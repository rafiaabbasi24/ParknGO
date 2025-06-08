const Logo = () => {
  return (
    <>
      {/* The main container for the logo, setting the font weight */}
      <span className="font-bold text-xl">
        
        {/* "Park" part with the gradient color */}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Park
        </span>
        
        {/* "N" part with a solid color that works in both light and dark modes */}
        <span className="text-zinc-900 dark:text-white">
          N
        </span>
        
        {/* "Go" part with the same gradient color */}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Go
        </span>

      </span>
    </>
  );
};

export default Logo;
