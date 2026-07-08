import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_auth_block = """  useEffect(() => {
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

pattern = re.compile(r"// Handle Supabase Sign-In auth state changes\s+useEffect\(\(\) => \{.*?(?=  const loadUserProfile)", re.DOTALL)
content = pattern.sub(new_auth_block + "\n\n", content)

handle_google_login = """  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        console.error("Google login failed:", error);
      }
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };"""

content = re.sub(r"  const handleSignInWithGoogle = async \(\) => \{.*?\};\n", handle_google_login + "\n", content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
