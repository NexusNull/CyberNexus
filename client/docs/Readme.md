Welcome to the documentation for CyberNexus
 
 How the Client initializes the game:
  
  1. Initialisation Phase:
  This means that going out from game all required classes are loaded and initialized.
  These things should happen in this stage:
     * fetching elements out of the DOM
     * registering EventListeners
  
  2. AssetLoading Phase:
  This phase has multiple stages
     1. The assetDB.json is loaded and parsed
     2. all images are loaded 
     3. TextureAtlases are created and finalized
     
  3. Limbo Stage:
  This Stage every asset has loaded and the UI is fully functional, yet no server connection has been
  established, this stage is basically the main menu in which the user can change their settings and connect to a server.
  This stage also marks the fixpoint to which should be reverted when disconnecting form a server. 
  
  4. Pre Game Stage:
  This stage is for future use
  
  5. Game Stage:
  This is the stage where the client is connected to the server and the client gameStage is being held in sync with the server.
  
     
 
  