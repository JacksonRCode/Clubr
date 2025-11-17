import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { interests } from '../mockData';

interface InterestSelectionProps {
  onComplete: (selectedInterests: string[]) => void;
}

export function InterestSelection({ onComplete }: InterestSelectionProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      onComplete(selectedInterests);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg border-orange-100">
        <CardHeader className="text-center space-y-2">
          <div className="inline-block mx-auto mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center">
              <span className="text-white">✨</span>
            </div>
          </div>
          <CardTitle className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
            What are you interested in?
          </CardTitle>
          <CardDescription>
            Select topics that interest you. We'll use this to recommend clubs you might like.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {interests.map((interest) => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 transition-all hover:scale-105 ${
                  selectedInterests.includes(interest)
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 border-transparent shadow-md'
                    : 'hover:border-orange-300 hover:bg-orange-50'
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>

          <div className="text-center space-y-4">
            <p className="text-amber-900">
              {selectedInterests.length} {selectedInterests.length === 1 ? 'topic' : 'topics'} selected
            </p>
            <Button
              onClick={handleContinue}
              disabled={selectedInterests.length === 0}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
            >
              Continue to Clubr
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
