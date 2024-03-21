import React, { useState } from 'react';
import { Heading2 } from '../../components/Heading';
import { Tabs } from '../../components/Tabs';
import { Tab1Content } from '../../components/Tabs/Tab1Content';
import { Tab2Content } from '../../components/Tabs/Tab2Content';
import NavForm from '../../layouts/components/Nav/NavForm'

export const Application = () => {

    return (
      <div>
        <Heading2 text="申請状況" />
        <div className='box-application'>
          <p className='txt-lead'>自分が行った申請の一覧です。</p>
          <div className='box-tab'>
            <NavForm />
          </div>
        </div>
      </div>
    );
};
