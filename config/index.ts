type MainConfigT = {
  canRegisterUser: boolean;
  canAddNewMenu: boolean;
  canAddNewConfig: boolean;
};

const mainConfig: MainConfigT = {
  canRegisterUser: false,
  canAddNewMenu: false,
  canAddNewConfig: false,
};

export default mainConfig;