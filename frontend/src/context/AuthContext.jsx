import { useState } from 'react';

import { AuthContext } from './AuthContextBase';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('ligred_user') || 'null')
  );

  const login = (userData, token) => {
    localStorage.setItem('ligred_token', token);
    localStorage.setItem('ligred_user', JSON.stringify(userData));
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem('ligred_token');
    localStorage.removeItem('ligred_user');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


