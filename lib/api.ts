import { 
  BrandRequest, 
  DetailedBrandRequest, 
  AgentProgress, 
  ProgressUpdate, 
  BrandStrategy, 
  GeneratedAsset, 
  BrandPackage 
} from './types';

export class BrandAPI {
  private baseURL: string;

  constructor() {
    // Use environment variable for backend URL, fallback to localhost
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Backend server is not available');
    }
  }

  async testAgents(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/test-agents`);
      return await response.json();
    } catch (error) {
      console.error('Agent test failed:', error);
      throw error;
    }
  }

  generateBrandPackage(
    request: BrandRequest | DetailedBrandRequest,
    onProgress: (update: ProgressUpdate) => void,
    onComplete: (result: BrandPackage) => void,
    onError: (error: string) => void
  ): EventSource {
    // Create FormData for the POST request
    const formData = new FormData();
    formData.append('startup_idea', request.startup_idea);

    // Since EventSource doesn't support POST directly, we'll use fetch with SSE
    return this.createSSEConnection(request, onProgress, onComplete, onError);
  }

  private createSSEConnection(
    request: BrandRequest | DetailedBrandRequest,
    onProgress: (update: ProgressUpdate) => void,
    onComplete: (result: BrandPackage) => void,
    onError: (error: string) => void
  ): EventSource {
    // Start the actual API call which handles SSE properly
    this.performGenerationRequest(request, onProgress, onComplete, onError);
    
    // Return a dummy EventSource (the real connection is handled in performGenerationRequest)
    return new EventSource('data:text/event-stream;charset=utf-8,');
  }

  private async performGenerationRequest(
    request: BrandRequest | DetailedBrandRequest,
    onProgress: (update: ProgressUpdate) => void,
    onComplete: (result: BrandPackage) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-brand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = line.slice(6); // Remove 'data: ' prefix
              const update: ProgressUpdate = JSON.parse(data);
              
              onProgress(update);
              
              if (update.completed && update.result) {
                onComplete(update.result);
                return;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation request failed:', error);
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  // Fallback method for demo purposes - simulates the real API
  simulateGeneration(
    _request: BrandRequest | DetailedBrandRequest,
    onProgress: (update: ProgressUpdate) => void,
    onComplete: (result: BrandPackage) => void,
    _onError: (error: string) => void
  ): NodeJS.Timeout {
    const packageId = Math.random().toString(36).substring(2, 9);
    let currentStep = 0;
    
    const agents = [
      { name: 'Brand Director', duration: 3000 },
      { name: 'Visual Creator', duration: 4000 },
      { name: 'Social Media Agent', duration: 3000 },
      { name: 'Video Creator', duration: 5000 }
    ];

    const runStep = () => {
      if (currentStep >= agents.length) {
        // Complete
        const mockResult: BrandPackage = {
          id: packageId,
          strategy: {
            company_name: 'FitGenius',
            alternative_names: ['FitIQ', 'SmartFit', 'FitCoach'],
            tagline: 'Your Personal Fitness Journey',
            positioning_statement: 'For fitness enthusiasts who want personalized guidance, FitGenius provides AI-powered coaching to optimize your workout results.',
            industry: 'Health & Fitness',
            target_audience: 'Fitness enthusiasts aged 25-45',
            customer_pain_points: ['Lack of personalized guidance', 'Plateauing progress', 'Inconsistent motivation'],
            unique_value_proposition: 'AI-powered personal fitness coaching that adapts to your progress',
            competitive_advantage: 'Advanced machine learning algorithms for personalized workout optimization',
            brand_personality: ['motivating', 'intelligent', 'trustworthy'],
            brand_archetype: 'The Sage',
            brand_values: [
              { value: 'Empowerment', explanation: 'We believe everyone can achieve their fitness goals with the right guidance' },
              { value: 'Innovation', explanation: 'We use cutting-edge AI to deliver personalized fitness solutions' }
            ],
            brand_story: 'FitGenius was born from the idea that everyone deserves a personal trainer. Using AI, we make expert fitness guidance accessible to everyone.',
            color_scheme: {
              primary: '#6366f1',
              secondary: '#8b5cf6',
              accent: '#06b6d4'
            },
            logo_style: 'modern and energetic',
            visual_elements: ['lightning bolts', 'geometric shapes', 'gradient accents'],
            typography_recommendations: {
              primary: 'Inter',
              secondary: 'Roboto'
            },
            domain_suggestions: ['fitgenius.com', 'getfitgenius.com', 'fitgenius.ai'],
            social_handles_availability: {
              instagram: true,
              twitter: true,
              linkedin: true,
              tiktok: false
            }
          },
          assets: [
            {
              type: 'logo',
              url: 'https://via.placeholder.com/512x512/6366f1/ffffff?text=LOGO',
              filename: 'logo.png'
            },
            {
              type: 'mockup',
              url: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=WEBSITE',
              filename: 'website_mockup.png'
            },
            {
              type: 'social_post',
              url: 'https://via.placeholder.com/400x400/06b6d4/ffffff?text=INSTAGRAM',
              filename: 'instagram_post.png'
            },
            {
              type: 'video',
              url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
              filename: 'promo_video.mp4'
            }
          ],
          created_at: new Date().toISOString(),
          status: 'completed',
          generation_time_seconds: 45
        };

        onComplete(mockResult);
        return;
      }

      const agent = agents[currentStep];
      const duration = agent.duration;
      const steps = 20; // Number of progress updates
      const stepDuration = duration / steps;

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        
        const agentProgresses = agents.map((a, i) => ({
          agent_name: a.name,
          status: i < currentStep ? 'completed' as const : 
                 i === currentStep ? 'in_progress' as const : 'pending' as const,
          progress: i < currentStep ? 100 : i === currentStep ? progress : 0,
          message: i < currentStep ? 'Completed' : 
                  i === currentStep ? `Working... ${progress}%` : 'Waiting...'
        }));

        onProgress({
          package_id: packageId,
          overall_progress: Math.round(((currentStep * 100) + progress) / agents.length),
          current_agent: agent.name,
          agents: agentProgresses,
          message: `${agent.name} is working...`,
          completed: false
        });

        if (progress >= 100) {
          clearInterval(progressInterval);
          currentStep++;
          setTimeout(runStep, 500); // Brief pause between agents
        }
      }, stepDuration);
    };

    const timeout = setTimeout(runStep, 1000);
    return timeout;
  }
}

export const brandAPI = new BrandAPI();