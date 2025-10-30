import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to VibeVault
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Log your emotional journey through movies, series, and documentaries. 
            Discover patterns in your viewing experiences and connect with friends.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100 shadow-lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-900 shadow-lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-xl hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white text-xl font-semibold drop-shadow-md">Emotional Logging</CardTitle>
              <CardDescription className="text-gray-200 drop-shadow-sm">
                Capture how movies and shows make you feel, not just ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 drop-shadow-sm leading-relaxed">
                Record your emotional responses, personal notes, and viewing patterns 
                to understand your media consumption better.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-xl hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white text-xl font-semibold drop-shadow-md">Discover Content</CardTitle>
              <CardDescription className="text-gray-200 drop-shadow-sm">
                Find new movies and series through TMDB integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 drop-shadow-sm leading-relaxed">
                Browse popular content, search for specific titles, and get 
                detailed information about movies and series.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-xl hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white text-xl font-semibold drop-shadow-md">Social Features</CardTitle>
              <CardDescription className="text-gray-200 drop-shadow-sm">
                Share your viewing experiences with friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 drop-shadow-sm leading-relaxed">
                Connect with friends, see what they&apos;re watching, and discover 
                new content through their recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}