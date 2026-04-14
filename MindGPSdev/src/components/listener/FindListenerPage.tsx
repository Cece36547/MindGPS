import { Button } from '@/components/ui/button';
import { getRandomIcebreaker } from '@/lib/icebreaker';

export function FindListenerPage() {
  const icebreaker = getRandomIcebreaker();

  // Main Finding a Listener Page
  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="border-2 border-blue-200 bg-blue-50 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">👂 Find an Anonymous Listener</h3>
        <p className="text-blue-700 text-sm">
          Connect with someone who listens. 🔒 E2E Encrypted • 👤 Anonymous • 💬 Judgment-Free
        </p>
      </div>

      {/* Main Section */}
      <div className="border-2 border-violet-200 bg-white p-8 rounded-2xl text-center">
        <div className="text-6xl mb-4">👂</div>
        <h2 className="text-2xl font-bold text-violet-900 mb-3">Ready to Talk?</h2>
        <p className="text-violet-700 mb-6">
          Share your thoughts with a trained listener. Both of you remain completely anonymous.
        </p>

        {/* Icebreaker Prompt Box */}
        <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg mb-8">
          <p className="text-sm text-gray-600 font-semibold mb-2">💭 Icebreaker to get started:</p>
          <p className="text-lg text-gray-800 italic font-medium">"{icebreaker.text}"</p>
        </div>

        {/* Communication Options */}
        <div className="flex flex-col gap-4">
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-5 rounded-lg text-lg transition shadow-lg"
          >
            💬 Start Text Chat
          </Button>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-lg text-lg transition shadow-lg"
          >
            📞 Start Voice Call
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-xs text-green-800">
            <strong>🔒 Security:</strong> All conversations are end-to-end encrypted. Your identity is fully protected.
          </p>
        </div>
      </div>
    </div>
  );
}
