import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { EmpirePanel } from '@/components/panels/EmpirePanel';
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
              <EmpirePanel />
            </GaProvider>
          </LootProvider>
        </CryptProvider>
      </RealmProvider>
      <ArtBackground background="warRoom" />
    </Layout>
  );
}
