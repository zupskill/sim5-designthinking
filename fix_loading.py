import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_auth_block = """  // Handle Supabase Sign-In auth state changes
  useEffect(() => {
    setLoadingAuth(true);
    supabase.auth.getSession().then(({ data }) => {
      console.log("Loaded Supabase session:", data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadUserProfile(data.session.user).finally(() => setLoadingAuth(false));
      } else {
        setLoadingAuth(false);
      }
    });

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
