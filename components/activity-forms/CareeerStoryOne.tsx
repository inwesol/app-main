"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Book, 
  PenTool, 
  Users, 
  Star, 
  ArrowRight, 
  Plus, 
  Trash2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Mock components that match your structure
const Header = ({ headerIcon: Icon, headerText, headerDescription }) => (
  <div className="text-center mb-8">
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-primary-green-100 rounded-full">
        <Icon className="size-8 text-primary-green-600" />
      </div>
    </div>
    <h1 className="text-3xl font-bold text-slate-800 mb-2">{headerText}</h1>
    <p className="text-slate-600 max-w-2xl mx-auto">{headerDescription}</p>
  </div>
);

const TextArea = ({ placeholder, rows, value, onChange, ...props }) => (
  <Textarea
    placeholder={placeholder}
    rows={rows}
    value={value}
    onChange={onChange}
    className="w-full"
    {...props}
  />
);

const BulletPointList = ({ 
  items, 
  onItemChange, 
  onAddItem, 
  onDeleteItem, 
  titlePlaceholder, 
  descriptionPlaceholder 
}) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <div key={item.id} className="border rounded-lg p-4 bg-white">
        <div className="flex justify-between items-start mb-3">
          <span className="font-medium text-primary-green-600">Hero #{index + 1}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDeleteItem(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <Input
            placeholder={titlePlaceholder}
            value={item.title}
            onChange={(e) => onItemChange(item.id, 'title', e.target.value)}
          />
          <Textarea
            placeholder={descriptionPlaceholder}
            value={item.description}
            onChange={(e) => onItemChange(item.id, 'description', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      onClick={onAddItem}
      className="w-full"
    >
      <Plus className="size-4 mr-2" />
      Add Hero/Role Model
    </Button>
  </div>
);

const QuestionSection = ({ title, subtitle, icon, children }) => (
  <Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
    <CardHeader>
      <div className="flex gap-3 items-center">
        <div className="p-2 bg-primary-green-100 rounded-lg">
          {icon}
        </div>
        <div>
          <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
            {title}
          </CardTitle>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            {subtitle}
          </p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

function CareerStoryForm() {
  const [formData, setFormData] = useState({
    transitionEssay: "",
    occupations: "",
    heroes: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [debugInfo, setDebugInfo] = useState("");

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.transitionEssay || formData.transitionEssay.length < 20) {
      newErrors.transitionEssay = "Please write at least 20 characters about your transition";
    }
    
    if (!formData.occupations || formData.occupations.trim().length === 0) {
      newErrors.occupations = "Please list at least one occupation";
    }
    
    // Check if heroes have both title and description
    const incompleteHeroes = formData.heroes.filter(hero => 
      !hero.title.trim() || !hero.description.trim()
    );
    
    if (incompleteHeroes.length > 0) {
      newErrors.heroes = "Please complete all hero entries with both name and description";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleHeroChange = (id, fieldName, value) => {
    const updatedHeroes = formData.heroes.map(hero =>
      hero.id === id ? { ...hero, [fieldName]: value } : hero
    );
    updateFormData('heroes', updatedHeroes);
  };

  const addHero = () => {
    const newHero = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    updateFormData('heroes', [...formData.heroes, newHero]);
  };

  const deleteHero = (id) => {
    const filteredHeroes = formData.heroes.filter(hero => hero.id !== id);
    updateFormData('heroes', filteredHeroes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitStatus(null);
    setDebugInfo("");
    
    // Validate form
    if (!validateForm()) {
      setSubmitStatus('error');
      setDebugInfo("Form validation failed. Please check the errors above.");
      return;
    }

    setIsLoading(true);

    try {
      const userId = "test-user-id"; // In real app, get from auth context
      
      const payload = {
        userId: userId,
        your_current_transition: formData.transitionEssay,
        career_asp: formData.occupations,
        heroes: formData.heroes.map(hero => ({
          name: hero.title,
          description: hero.description,
        })),
      };

      setDebugInfo(`Attempting to submit to: /api/journey/q/career-story-1\nPayload: ${JSON.stringify(payload, null, 2)}`);

      // Simulate API call for demo - replace with actual fetch
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success
          resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, message: "Data saved successfully" })
          });
          
          // To simulate an error, uncomment this instead:
          // reject(new Error("API endpoint not found"));
        }, 1000);
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save progress');
      }

      setSubmitStatus('success');
      setDebugInfo(`Success! Response: ${JSON.stringify(result, null, 2)}`);

    } catch (error) {
      setSubmitStatus('error');
      setDebugInfo(`Error: ${error.message}\n\nThis could be because:\n1. The API endpoint /api/journey/q/career-story-1 doesn't exist\n2. Server is not running\n3. Network connection issue\n4. CORS policy blocking the request`);
      console.error('Error saving progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Header
          headerIcon={Book}
          headerText="Career Story Exploration - 1"
          headerDescription="Discover your true potential through self-reflection, an inward journey that reveals your values, passions, and purpose, guiding you toward a more meaningful path."
        />

        <div>
          {/* Transition Essay */}
          <Card className="mb-6 bg-gradient-to-br from-green-50/50 to-blue-50/50 border-green-100/60">
            <CardHeader>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PenTool className="sm:size-5 text-green-600 size-4" />
                </div>
                <CardTitle className="text-green-600 text-lg sm:text-xl">
                  Your Current Transition
                </CardTitle>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                Write a brief essay about the transition you are now facing. What chapter are you closing? What new chapter are you beginning? What guidance are you seeking?
              </p>
            </CardHeader>
            <CardContent>
              <TextArea
                placeholder="Write about the transition you are currently facing..."
                rows={6}
                value={formData.transitionEssay}
                onChange={(e) => updateFormData('transitionEssay', e.target.value)}
              />
              {errors.transitionEssay && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  {errors.transitionEssay}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Occupations */}
          <Card className="mb-6 bg-gradient-to-br from-green-50/50 to-blue-50/50 border-green-100/60">
            <CardHeader>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="sm:size-5 text-green-600 size-4" />
                </div>
                <CardTitle className="text-green-600 text-lg sm:text-xl">
                  Career Aspirations
                </CardTitle>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                List all of the occupations you have thought about doing. Include any job or career that has sparked your interest at any point in your life.
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List all occupations you've ever considered, both past and present..."
                rows={4}
                value={formData.occupations}
                onChange={(e) => updateFormData('occupations', e.target.value)}
              />
              {errors.occupations && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  {errors.occupations}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Heroes Section */}
          <QuestionSection
            title="Childhood Heroes & Role Models"
            subtitle="Who did you admire when you were growing up? List three people, other than your mom and dad, who you admired when you were a child of about six, seven, or eight years old."
            icon={<Star className="sm:size-5 text-green-600 size-4" />}
          >
            <BulletPointList
              items={formData.heroes}
              onItemChange={handleHeroChange}
              onAddItem={addHero}
              onDeleteItem={deleteHero}
              titlePlaceholder="Hero/Role Model"
              descriptionPlaceholder="Describe what you admired about this person..."
            />
            {errors.heroes && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                <AlertCircle className="size-4" />
                {errors.heroes}
              </p>
            )}
          </QuestionSection>

          {/* Status Messages */}
          {submitStatus && (
            <Card className={`mb-6 ${submitStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-6">
                <div className={`flex items-center gap-2 ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    <AlertCircle className="size-5" />
                  )}
                  <span className="font-medium">
                    {submitStatus === 'success' ? 'Success!' : 'Error'}
                  </span>
                </div>
                {debugInfo && (
                  <pre className="mt-3 text-xs bg-white/50 p-3 rounded border overflow-x-auto">
                    {debugInfo}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="text-center mt-8">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="group relative px-10 py-6 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <span>{isLoading ? 'Saving...' : 'Save Progress'}</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <Card className="mt-8 border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-700 text-lg">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Form Valid:</strong> {Object.keys(errors).length === 0 ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Transition Essay Length:</strong> {formData.transitionEssay.length} characters</p>
              <p><strong>Occupations Length:</strong> {formData.occupations.length} characters</p>
              <p><strong>Heroes Count:</strong> {formData.heroes.length}</p>
              <p><strong>Complete Heroes:</strong> {formData.heroes.filter(h => h.title.trim() && h.description.trim()).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CareerStoryForm;