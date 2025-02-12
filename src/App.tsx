import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { Navigation } from './navigation';
import { database } from './model/database';
import { DatabaseProvider } from '@nozbe/watermelondb/react';

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <DatabaseProvider database={database}>
      <Navigation
        linking={{
          enabled: 'auto',
          prefixes: [
            // Change the scheme to match your app's scheme defined in app.json
            'mytodo://',
          ],
        }}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </DatabaseProvider>
  );
}
