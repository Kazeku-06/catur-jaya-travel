// Token Debug Utilities
export const tokenDebug = {
  // Get current token info
  getCurrentToken: () => {
    const token = localStorage.getItem('auth_token');
    const userData = JSON.parse(localStorage.getItem('user_data') || 'null');
    
    return {
      token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'None',
      tokenLength: token ? token.length : 0,
      userData,
      userRole: userData?.role,
      userEmail: userData?.email
    };
  },

  // Log token info
  logTokenInfo: (context = '') => {
    const info = tokenDebug.getCurrentToken();
    console.log(`🔍 Token Debug ${context}:`, info);
    return info;
  },

  // Test token with backend
  testToken: async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/test-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.text();
      
      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: response.ok ? JSON.parse(data) : data,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Compare tokens
  compareTokens: (token1, token2) => {
    console.log('🔄 Token Comparison:', {
      token1Preview: token1 ? token1.substring(0, 20) + '...' : 'None',
      token2Preview: token2 ? token2.substring(0, 20) + '...' : 'None',
      areEqual: token1 === token2,
      token1Length: token1 ? token1.length : 0,
      token2Length: token2 ? token2.length : 0
    });
    
    return token1 === token2;
  }
};

// Auto-log token info on module load
if (typeof window !== 'undefined') {
  tokenDebug.logTokenInfo('(Module Load)');
}