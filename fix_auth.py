import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_auth_block = """  // Handle Supabase Sign-In auth state changes
  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      setLoadingAuth(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadUserProfile(session.user);
          }
        }
      } catch (err) {
        console.error("Initial session error:", err);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      setLoadingAuth(true);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setLoadingAuth(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUser: any) => {
    try {
      const { getOrCreateUser } = await import('./utils/auth');
      const currentUser = await getOrCreateUser();
      
      if (!currentUser) {
        console.error("Failed to initialize central user record.");
        return;
      }
      
      const cloudProfile = await getSupabaseProfile(currentUser.id);
      if (cloudProfile) {
        setProfile(prev => ({
          ...prev,
          ...cloudProfile,
          username: cloudProfile.username || currentUser.full_name || currentUser.email?.split("@")[0] || "Innovator",
          email: currentUser.email || "",
          photoURL: currentUser.avatar_url || "",
          lastCompletedSimulation: cloudProfile.lastCompletedSimulation || prev.lastCompletedSimulation
        }));
      } else {
        setProfile(prev => ({
          ...prev,
          uid: currentUser.id,
          username: currentUser.full_name || currentUser.email?.split("@")[0] || "Innovator",
          email: currentUser.email || "",
          photoURL: currentUser.avatar_url || "",
          level: "Explorer",
          xp: 60,
          unlockedBadgeIds: ["problem-hunter"],
          isOnboarded: false
        }));
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  };"""

# Use regex to replace the block
pattern = re.compile(r"// Handle Supabase Sign-In auth state changes\s+useEffect\(\(\) => \{.*?(?=  // Redirect to Auth or Onboarding based on session status)", re.DOTALL)
content = pattern.sub(new_auth_block + "\n\n", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
