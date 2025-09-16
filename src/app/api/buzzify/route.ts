import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { shouldResetRequests, getEffectiveFreeRequestsUsed, getTodayMidnightUTC } from '@/lib/request-reset';

interface Profile {
  id: string;
  email: string | null;
  api_key: string | null;
  free_requests_used: number;
  free_requests_reset_at: string;
  created_at: string;
  updated_at: string;
}

export async function POST(req: NextRequest) {
  try {
    const { text, apiKey, length = 'medium' } = await req.json();
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Try to get user from Authorization header first
    const authHeader = req.headers.get('authorization');
    let supabase;
    let user = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Create a client with the access token
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );
      
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser();
      if (!tokenError && tokenUser) {
        user = tokenUser;
      }
    }

    // Fallback to cookie-based auth
    if (!user) {
      const { supabase: cookieSupabase } = await createClient(req);
      const { data: { user: cookieUser }, error: cookieError } = await cookieSupabase.auth.getUser();
      if (!cookieError && cookieUser) {
        user = cookieUser;
        supabase = cookieSupabase;
      }
    }
    
    console.log('Auth check:', { user: user?.id });
    
    if (!user || !supabase) {
      console.log('Request cookies:', req.cookies.getAll());
      console.log('Auth header:', authHeader);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get or create user profile
    let { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, create it
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          free_requests_used: 0,
          free_requests_reset_at: getTodayMidnightUTC().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
      }

      profile = newProfile;
    } else if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
    }

    const typedProfile = profile as Profile;
    
    // Check if we need to reset the daily requests
    let effectiveFreeRequestsUsed = getEffectiveFreeRequestsUsed(typedProfile);
    let needsReset = shouldResetRequests(typedProfile.free_requests_reset_at);
    
    // If we need to reset, update the database
    if (needsReset) {
      const { error: resetError } = await (supabase as any)
        .from('profiles')
        .update({
          free_requests_used: 0,
          free_requests_reset_at: getTodayMidnightUTC().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (resetError) {
        console.error('Error resetting requests:', resetError);
        // Continue anyway, using the calculated effective count
      } else {
        effectiveFreeRequestsUsed = 0;
      }
    }
    
    const freeRequestsRemaining = Math.max(0, 5 - effectiveFreeRequestsUsed);
    let useUserApiKey = false;
    let usedFreeRequest = false;

    // Determine which API key to use
    let activeApiKey = process.env.OPENAI_API_KEY;

    if (freeRequestsRemaining === 0) {
      // No free requests left, must use user's API key
      const userApiKey = apiKey || typedProfile.api_key;
      if (!userApiKey) {
        return NextResponse.json({ 
          error: 'No free requests remaining. Please provide your OpenAI API key.',
          free_requests_remaining: 0
        }, { status: 400 });
      }
      activeApiKey = userApiKey;
      useUserApiKey = true;
    } else {
      // Use free request
      usedFreeRequest = true;
    }

    if (!activeApiKey) {
      return NextResponse.json({ error: 'No API key available' }, { status: 500 });
    }

    // Create OpenAI client with the appropriate API key
    const openai = new OpenAI({ apiKey: activeApiKey });

    const prompt = `Transform the following text into buzzword-rich, engaging content that sounds professional and trendy. Keep the core meaning but make it more exciting and business-oriented with popular buzzwords:

"${text}"

Rules:
- Keep the original meaning intact
- Use modern business buzzwords and trendy terms
- Make it sound more professional and complex
- Length should be ${length === 'short' ? 'concise and brief' : length === 'medium' ? 'moderately detailed' : 'extensively detailed with multiple sentences'}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: "You are a jargon-generator that transforms plain English into overblown business and tech buzzwords. Replace straightforward ideas with visionary, abstract, or innovation-driven phrasing where the original meaning is mostly obscured but still marginally related. For example: \"we should save money\" → \"unlock synergistic cost-optimization through scalable efficiencies\"; \"make the code run faster\" → \"architect hyper-optimized, next-gen compute acceleration pipelines.\" Make your outputs as creative as possible, and extend the length of the text as much as you want to include more buzzwords. You should make it as ridiculous as possible. Here is a list of some buzzwords Synergy, Value-add, Strategic alignment, Core competencies, Holistic framework, Scalable efficiencies, Stakeholder engagement, Operational excellence, Competitive advantage, Paradigm shift, Change management, Customer-centric approach, Ecosystem integration, Thought leadership, Seamless delivery, Leverage best practices, Next-level optimization, End-to-end solution, Agile transformation, ROI maximization, Cloud-native architecture, Hyper-automation, AI-driven insights, Quantum-ready infrastructure, Blockchain-enabled trust, Neural acceleration pipelines, Edge computing scalability, Zero-trust security, Data lakehouse integration, Microservices orchestration, Generative intelligence, Autonomous workflows, API-first design, Serverless deployment, Digital twin ecosystems, Smart contracts, Self-healing networks, Predictive analytics, Cross-platform enablement, Next-gen compute fabric"
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim() || 'No result generated';

    // Update usage tracking
    if (usedFreeRequest) {
      const newUsedCount = needsReset ? 1 : effectiveFreeRequestsUsed + 1;
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({ 
          free_requests_used: newUsedCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        // Don't fail the request for this
      }
    }

    // Log the request
    const { error: logError } = await (supabase as any)
      .from('requests')
      .insert({
        user_id: user.id,
        input_text: text,
        output_text: result,
        used_free_request: usedFreeRequest
      });

    if (logError) {
      console.error('Error logging request:', logError);
      // Don't fail the request for this
    }

    return NextResponse.json({
      result,
      used_free_request: usedFreeRequest,
      free_requests_remaining: usedFreeRequest ? freeRequestsRemaining - 1 : freeRequestsRemaining
    });

  } catch (error: any) {
    console.error('Buzzify API error:', error);
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json({ error: 'Invalid OpenAI API key provided' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to process request: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
}
