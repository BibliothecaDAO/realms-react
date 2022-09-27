import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { AccountPanel } from '@/components/panels/AccountPanel';
import { CryptProvider } from '@/context/CryptContext';
import { GaProvider } from '@/context/GaContext';
import { LootProvider } from '@/context/LootContext';
import { RealmProvider } from '@/context/RealmContext';

export default function AccountPage() {
  return (
    <Layout>
      <RealmProvider>
        <CryptProvider>
          <LootProvider>
            <GaProvider>
              <AccountPanel />
            </GaProvider>
          </LootProvider>
        </CryptProvider>
      </RealmProvider>
      <ArtBackground background="warRoom" />
    </Layout>
  );
}
