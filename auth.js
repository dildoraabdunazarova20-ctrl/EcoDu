// supabase-client.js - Updated for Username Authentication
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Get current user from localStorage (username-based auth)
export async function getCurrentUser() {
  const username = localStorage.getItem('ecodu_username');
  if (!username) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();
    
  if (error || !data) {
    localStorage.removeItem('ecodu_username');
    return null;
  }
  
  return data;
}

export async function getProfile(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

// Username-based registration
export async function signUp(username, password, name) {
  // Check if username already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle();
    
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  // Create new user profile
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        username: username,
        password: password, // In production, hash this!
        name: name,
        bio: '',
        avatar_url: null
      }
    ])
    .select()
    .single();

  if (error) throw error;
  
  // Auto login after registration
  localStorage.setItem('ecodu_username', username);
  
  return data;
}

// Username-based login
export async function signIn(username, password) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .maybeSingle();

  if (error || !data) {
    throw new Error('Invalid username or password');
  }
  
  localStorage.setItem('ecodu_username', username);
  return data;
}

export async function signOut() {
  localStorage.removeItem('ecodu_username');
}

export async function updateProfile(username, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('username', username)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAvatar(username, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${username}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}
