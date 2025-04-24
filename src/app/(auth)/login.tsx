import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
        await signInWithEmailAndPassword(auth, email, password);


    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 p-6 justify-center">
        {/* Logo/Header Section */}
        <View className="items-center mb-10">
        <Image
            source={require('../../../assets/logo.png')}
            className="w-40 h-40 mb-4"
          />
          <Text className="text-2xl font-bold text-gray-800">
            Welcome Back
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Sign in to manage your esports teams
          </Text>
        </View>

        {/* Form Section */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <Text className="text-gray-700 mb-2 font-medium">
              Email Address
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mt-4">
            <Text className="text-gray-700 mb-2 font-medium">
              Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-2"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>


          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-center">
              {error}
            </Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-lg py-4 px-6 mt-4 ${
              loading ? 'bg-blue-300' : 'bg-blue-500'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-blue-500 font-medium">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;