 import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
 import { User, Session } from '@supabase/supabase-js';
 import { supabase } from '@/integrations/supabase/client';
 import { AppRole, Profile } from '@/lib/types';
 
 interface AuthContextType {
   user: User | null;
   session: Session | null;
   profile: Profile | null;
   role: AppRole | null;
   isLoading: boolean;
   signUp: (email: string, password: string, fullName: string, role: AppRole) => Promise<{ error: Error | null }>;
   signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
   signOut: () => Promise<void>;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [profile, setProfile] = useState<Profile | null>(null);
   const [role, setRole] = useState<AppRole | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         
         if (session?.user) {
           setTimeout(async () => {
             await fetchUserData(session.user.id);
           }, 0);
         } else {
           setProfile(null);
           setRole(null);
         }
         setIsLoading(false);
       }
     );
 
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       if (session?.user) {
         fetchUserData(session.user.id);
       } else {
         setIsLoading(false);
       }
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const fetchUserData = async (userId: string) => {
     try {
       const [profileResult, roleResult] = await Promise.all([
         supabase.from('profiles').select('*').eq('user_id', userId).single(),
         supabase.from('user_roles').select('role').eq('user_id', userId).single(),
       ]);
 
       if (profileResult.data) {
         setProfile(profileResult.data as Profile);
       }
       if (roleResult.data) {
         setRole(roleResult.data.role as AppRole);
       }
     } catch (error) {
       console.error('Error fetching user data:', error);
     }
   };
 
   const signUp = async (email: string, password: string, fullName: string, role: AppRole) => {
     const { data, error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         data: { full_name: fullName },
         emailRedirectTo: window.location.origin,
       },
     });
 
     if (error) return { error };
 
     if (data.user) {
       const { error: roleError } = await supabase.from('user_roles').insert({
         user_id: data.user.id,
         role,
       });
 
       if (roleError) {
         console.error('Error setting user role:', roleError);
         return { error: new Error('Failed to set user role') };
       }
     }
 
     return { error: null };
   };
 
   const signIn = async (email: string, password: string) => {
     const { error } = await supabase.auth.signInWithPassword({ email, password });
     return { error };
   };
 
   const signOut = async () => {
     await supabase.auth.signOut();
     setProfile(null);
     setRole(null);
   };
 
   return (
     <AuthContext.Provider value={{ user, session, profile, role, isLoading, signUp, signIn, signOut }}>
       {children}
     </AuthContext.Provider>
   );
 }
 
 export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
 }