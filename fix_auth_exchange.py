import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_auth_block = """  // Handle Supabase Sign-In auth state changes
  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      setLoadingAuth(true);
      try {
        let currentSession = null;
        const isCallback = window.location.pathname.startsWith("/auth/callback") || window.location.search.includes("code=");
        
        if (isCallback) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          if (code) {
            console.log("[Client Auth Callback] Exchanging code for session...");
            try {
              const { data } = await supabase.auth.exchangeCodeForSession(code);
              currentSession = data.session;
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname.replace("/auth/callback", "/"));
            } catch (e) {
              console.error("[Client Auth Callback] Exchange failed:", e);
            }
          }
        }

        const { data: { session } } = currentSession ? { data: { session: currentSession } } : await supabase.auth.getSession();
        
        if (window.location.hash.includes("access_token") || window.location.hash.includes("error_description")) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

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
  }, []);"""

pattern = re.compile(r"// Handle Supabase Sign-In auth state changes\s+useEffect\(\(\) => \{.*?(?=  const loadUserProfile)", re.DOTALL)
content = pattern.sub(new_auth_block + "\n\n", content)

# Also fix the redirectTo in handleSignInWithGoogle
content = content.replace("redirectTo: window.location.origin,", "redirectTo: `${window.location.origin}/auth/callback`,")

with open('src/App.tsx', 'w') as f:
    f.write(content)
