type MainConfigT = {
  canRegisterUser: boolean;
  canAddNewMenu: boolean;
  canAddNewConfig: boolean;
  // Storage configuration
  useLocalStorage: boolean; // true = use local storage, false = use Google Drive
  maxStorageSize: number; // Maximum storage size in bytes (default: 5GB = 5 * 1024 * 1024 * 1024)
};

const mainConfig: MainConfigT = {
  canRegisterUser: false,
  canAddNewMenu: false,
  canAddNewConfig: false,
  useLocalStorage: false, // Set to true to use local storage instead of Google Drive
  maxStorageSize: 5 * 1024 * 1024 * 1024, // 5GB in bytes
};

export default mainConfig;