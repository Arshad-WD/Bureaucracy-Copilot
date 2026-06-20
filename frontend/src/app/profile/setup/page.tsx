'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { profile, updateProfile, isAuthenticated, loading, error, loadProfile } = useAuthStore();

  const [step, setStep] = useState(1);

  // Form Fields State
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<string>('Male');
  const [state, setState] = useState<string>('Maharashtra');
  const [educationLevel, setEducationLevel] = useState<string>('Engineering');
  const [institutionType, setInstitutionType] = useState<string>('Private');
  const [annualIncome, setAnnualIncome] = useState<number>(300000);
  const [category, setCategory] = useState<string>('OBC');
  const [disability, setDisability] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
    } else {
      loadProfile().then(() => {
        // Pre-fill if exists
        const currentProfile = useAuthStore.getState().profile;
        if (currentProfile) {
          if (currentProfile.age) setAge(currentProfile.age);
          if (currentProfile.gender) setGender(currentProfile.gender);
          if (currentProfile.state) setState(currentProfile.state);
          if (currentProfile.educationLevel) setEducationLevel(currentProfile.educationLevel);
          if (currentProfile.institutionType) setInstitutionType(currentProfile.institutionType);
          if (currentProfile.annualIncome) setAnnualIncome(currentProfile.annualIncome);
          if (currentProfile.category) setCategory(currentProfile.category);
          if (currentProfile.disability !== undefined) setDisability(currentProfile.disability);
        }
      });
    }
  }, [isAuthenticated, router, loadProfile]);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const success = await updateProfile({
      age,
      gender,
      state,
      educationLevel,
      institutionType,
      annualIncome,
      category,
      disability,
    });
    if (success) {
      router.push('/dashboard');
    }
  };

  const progressPercent = (step / 3) * 100;

  return (
    <div className="flex-grow max-w-2xl mx-auto w-full py-12 px-4 sm:px-6">
      {/* Progress Bar */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Setup Your Profile</h2>
        <p className="text-sm text-gray-500 font-light mt-1">This data evaluates your scholarship matches instantly</p>
        <div className="w-full bg-gray-200 h-2.5 rounded-full mt-6 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
          <span className={step >= 1 ? 'text-blue-600 font-bold' : ''}>Personal Info</span>
          <span className={step >= 2 ? 'text-blue-600 font-bold' : ''}>Academics</span>
          <span className={step >= 3 ? 'text-blue-600 font-bold' : ''}>Financials</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-3 text-gray-800">1. Personal Information</h3>
            <div className="grid gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Age</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State of Domicile</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t mt-8">
              <button
                onClick={handleNext}
                className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Academic Info */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-3 text-gray-800">2. Academic Profile</h3>
            <div className="grid gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Current Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="School (up to 10th)">School (up to 10th)</option>
                  <option value="Higher Secondary (11th-12th)">Higher Secondary (11th-12th)</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Institution Type</label>
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Government">Government Institution</option>
                  <option value="Government-Aided">Government-Aided Institution</option>
                  <option value="Private">Private Institution</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-6 border-t mt-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Financial Info */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-3 text-gray-800">3. Financial & Demographic Details</h3>
            <div className="grid gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Annual Family Income (INR)</label>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="Minority">Minority Communities</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  id="disability"
                  type="checkbox"
                  checked={disability}
                  onChange={(e) => setDisability(e.target.checked)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="disability" className="text-sm font-medium text-gray-700 cursor-pointer selection:bg-transparent">
                  I have a physical disability (Person with Disability status)
                </label>
              </div>
            </div>
            <div className="flex justify-between pt-6 border-t mt-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Finish & Get Matches
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
