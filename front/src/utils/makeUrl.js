const makeImgURL = (type, fileName) => {
  switch (type) {
    case 'profile':
      return `${import.meta.env.VITE_S3_URL}${
        import.meta.env.VITE_S3_PROFILE_IMG
      }${fileName}`;
    case 'challenge':
      return `${import.meta.env.VITE_S3_URL}${
        import.meta.env.VITE_S3_CHALLENGE_IMG
      }${fileName}`;
    case 'product':
      return `${import.meta.env.VITE_S3_URL}${
        import.meta.env.VITE_S3_PRODUCT_IMG
      }${fileName}`;
    case 'research':
      return `${import.meta.env.VITE_S3_URL}${
        import.meta.env.VITE_S3_RESEARCH_IMG
      }${fileName}`;
    case 'meal':
      return `${import.meta.env.VITE_S3_URL}${
        import.meta.env.VITE_S3_MEAL_IMG
      }${fileName}`;
    default:
      return `${import.meta.env.VITE_S3_URL}${fileName}`;
  }
};

export const makeTermsUrl = (fileName = 'term.md') => {
  return `${import.meta.env.VITE_S3_URL}${
    import.meta.env.VITE_S3_TERMS
  }${fileName}`;
};

export const makePrivacyPolicyUrl = (fileName = 'privacy-policy.md') => {
  return `${import.meta.env.VITE_S3_URL}${
    import.meta.env.VITE_S3_PRIVACY_POLICY
  }${fileName}`;
};

export const makeImgProfileUrl = (fileName) => {
  return makeImgURL('profile', fileName);
};

export const makeImgChallengeUrl = (fileName) => {
  return makeImgURL('challenge', fileName);
};

export const makeImgProductUrl = (fileName) => {
  return makeImgURL('product', fileName);
};

export const makeImgResearchUrl = (fileName) => {
  return makeImgURL('research', fileName);
};

export const makeImgMealUrl = (fileName) => {
  return makeImgURL('meal', fileName);
};

export const makeTemplateUrl = (empNo, fileName) => {
  return `${import.meta.env.VITE_S3_URL}template/${empNo}/img/${fileName}`;
};
