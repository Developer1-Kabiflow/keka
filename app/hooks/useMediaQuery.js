// /app/hooks/useMediaQuery.js

import { useState, useEffect } from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
