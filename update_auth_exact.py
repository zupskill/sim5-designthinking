import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_auth_block = """  // Handle Supabase Sign-In auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Loaded Supabase session:", data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadUserProfile(data.session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event, session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);"""

pattern = re.compile(r"  useEffect\(\(\) => \{\n    supabase\.auth\.getSession\(\).*?return \(\) => subscription\.unsubscribe\(\);\n  \}, \[\]\);", re.DOTALL)
content = pattern.sub(new_auth_block, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
