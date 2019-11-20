import React, { useEffect, useState } from 'react';
import { helloWorldApi } from '../config/endpoints';
import RoutedPage from './page-wrapper/RoutedPage';

export default function HelloWorldPage() {
  const [text, setText] = useState('');
  useEffect(() => {
    fetch(helloWorldApi)
      .then(response => response.text())
      .then(setText);
  }, []);

  return (
    <RoutedPage pageTitle="Testing page">
      <h1>{text}</h1>
    </RoutedPage>
  );
}
