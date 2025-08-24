import React, {createContext, useContext, useMemo, useState} from 'react';
import {lightTokens, Tokens} from './tokens';
import {View} from 'react-native';
const ThemeCtx = createContext<{tokens: Tokens; setTokens: (t: Tokens)=>void}>({tokens: lightTokens, setTokens: ()=>{}});
export const useThemeTokens = () => useContext(ThemeCtx);
export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const [tokens, setTokens] = useState<Tokens>(lightTokens);
  const value = useMemo(()=>({tokens, setTokens}), [tokens]);
  return <ThemeCtx.Provider value={value}><View style={{flex:1, backgroundColor: tokens.bg}}>{children}</View></ThemeCtx.Provider>;
};
