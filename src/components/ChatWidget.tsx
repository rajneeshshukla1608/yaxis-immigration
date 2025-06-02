import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Y-Axis assistant. I can help you with questions about our visa and immigration services. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedResponses: Record<string, string> = {
    'tourist visa': 'Our Tourist Visa service costs $150 and includes complete guidance for tourist visa application, document preparation, and interview tips. The processing time is typically 2-3 weeks.',
    'work visa': 'Our Work Visa Processing service is $500 and includes full work visa application support with employer liaison and documentation assistance. Processing time varies by country but typically takes 4-8 weeks.',
    'student visa': 'Our Student Visa Package costs $300 and includes comprehensive student visa services, university applications, and financial guidance. We have partnerships with top universities worldwide.',
    'business visa': 'Our Business Visa Services cost $400 and include professional business visa consultation with meeting arrangements and documentation. Perfect for entrepreneurs and business travelers.',
    'family visa': 'Our Family Reunion Visa service is $350 and includes family visa processing with relationship documentation and application support.',
    'express': 'Our Express Visa Service costs $200 and provides fast-track visa processing for urgent travel requirements. Processing time is reduced to 1-2 weeks.',
    'immigration': 'Our Immigration Consultation service is $250 and includes one-on-one consultation for permanent residency and immigration pathways.',
    'translation': 'Our Document Translation service costs $100 and provides certified translation services for visa documents and official papers.',
    'price': 'Our services range from $100 to $500 depending on the type of visa and complexity. We also offer bundle discounts when you purchase multiple services.',
    'discount': 'Yes! We offer a 10% bundle discount when you purchase 2 or more services together.',
    'processing time': 'Processing times vary by service: Tourist visas (2-3 weeks), Work visas (4-8 weeks), Student visas (3-6 weeks), Express service (1-2 weeks).',
    'countries': 'We provide visa services for 40+ countries including Canada, Australia, USA, UK, Germany, and many more.',
    'success rate': 'Y-Axis has a 95%+ visa approval rate across all categories, backed by our 25+ years of experience.',
    'consultation': 'We offer free initial consultations to assess your eligibility and recommend the best visa pathway for your goals.'
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you with Y-Axis visa and immigration services. You can ask me about our services, pricing, processing times, or countries we serve.";
    }

    if (lowerMessage.includes('help')) {
      return "I can help you with information about our visa services including tourist, work, student, business, and family visas. I can also provide details about pricing, processing times, and our immigration consultation services.";
    }

    return "I'd be happy to help! You can ask me about our visa services, pricing, processing times, countries we serve, or any other questions about Y-Axis immigration services. For specific cases, I recommend booking a consultation with our experts.";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    const aiResponse: Message = {
      id: messages.length + 2,
      text: getAIResponse(inputMessage),
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 rounded-full h-14 w-14 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px]">
          <Card className="h-full shadow-xl flex flex-col overflow-hidden">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Y-Axis Assistant</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-blue-700 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-grow p-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm break-words ${message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white shrink-0">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our services..."
                    className="flex-1 min-w-0"
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </>
  );
};
