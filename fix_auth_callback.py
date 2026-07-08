import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_auth_block = """  // Handle Supabase Sign-In auth state changes
  useEffect(() => {
    setLoadingAuth(true);
    
    const initializeAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        if (code) {
          console.log("Exchanging code for session...");
          await supabase.auth.exchangeCodeForSession(code);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error("Code exchange failed:", e);
      }
      
      supabase.auth.getSession().then(({ data }) => {
        console.log("Loaded Supabase session:", data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          loadUserProfile(data.session.user).finally(() => setLoadingAuth(false));
        } else {
          setLoadingAuth(false);
        }
      });
    };
    
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event, session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoadingAuth(true);
        loadUserProfile(session.user).finally(() => setLoadingAuth(false));
      } else {
        setLoadingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);"""

pattern = re.compile(r"// Handle Supabase Sign-In auth state changes\s+useEffect\(\(\) => \{.*?(?=  const loadUserProfile)", re.DOTALL)
content = pattern.sub(new_auth_block + "\n\n", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
