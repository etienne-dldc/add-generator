import React from 'react';
import store from 'store2';

import { TextInput } from './TextInput';
import { TextArea } from './TextArea';
import { ReasonChoice } from './ReasonChoice';
import { Reason, generateDocument } from './generateDocument';
import { DayMonthInput } from './DayMonthInput';
import { SignatureInput, Signature } from './SignatureInput';
import { CheckBox } from './CheckBox';

const STORAGE_KEY = `add-generator-v3`;

const now = new Date();

const MISSING_MESSAGE = {
  name: `Le nom n'est pas renseigné`,
  birthdate: `La date de naissance n'est pas renseignée`,
  address: `L'adresse n'est pas renseignée`,
  reason: `Vous n'avez pas sélectionné de motif`,
  place: `Le lieu (fait à) n'est pas renseigné`,
  signature: `Vous n'avez pas ajouté de signature`
};

const WarningIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-alert-triangle"
      viewBox="0 0 24 24"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
      <path d="M12 9L12 13"></path>
      <path d="M12 17L12.01 17"></path>
    </svg>
  );
};

interface StoreData {
  name: string;
  birthdate: string;
  address: string;
  place: string;
  signature: Signature | null;
}

const DEFAULT: StoreData = {
  name: '',
  birthdate: '',
  address: '',
  place: '',
  signature: null
};

function getStoreData(): StoreData {
  return store.get(STORAGE_KEY, DEFAULT);
}

function setStoreData(data: StoreData) {
  return store.set(STORAGE_KEY, data);
}

function isFacebookBrowser() {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
}

const IS_FACEBOOK_BROWSER = isFacebookBrowser();

function App() {
  const [name, setName] = React.useState(() => getStoreData().name);
  const [birthdate, setBirthdate] = React.useState<string>(() => getStoreData().birthdate);
  const [address, setAddress] = React.useState<string>(() => getStoreData().address);
  const [reason, setReason] = React.useState<Reason | null>(null);
  const [place, setPlace] = React.useState<string>(() => getStoreData().place);
  const [day, setDay] = React.useState<number>(() => now.getDate());
  const [month, setMonth] = React.useState<number>(() => now.getMonth());
  const [signature, setSignature] = React.useState<Signature | null>(
    () => getStoreData().signature
  );
  const [save, setSave] = React.useState(true);

  const missingInfos = React.useMemo(() => {
    return {
      name: name.length === 0,
      birthdate: birthdate.length === 0,
      address: address.length === 0,
      reason: reason === null,
      place: place.length === 0,
      signature: signature === null
    };
  }, [address.length, birthdate.length, name.length, place.length, reason, signature]);

  const missingMessages = Object.entries(missingInfos)
    .filter(([k, v]) => v)
    .map(([k, v]) => (MISSING_MESSAGE as any)[k]);

  return (
    <div className="App">
      <h1 className="App--title">Attestation de Déplacement Dérogatoire</h1>
      {IS_FACEBOOK_BROWSER && (
        <div className="App--info">
          <WarningIcon />
          <p>
            Vous utilisez actuellement le navigateur Facebook, ce site ne fonctionne pas
            correctement au sein de ce navigateur ! Merci d'ouvrir Chrome sur Android ou bien Safari
            sur iOS.
          </p>
        </div>
      )}
      <div className="App--info">
        <WarningIcon />
        <p>
          Attention, vous devez imprimer vos attestations ! Les versions numériques ne sont pas
          acceptées (vous ne pouvez donc pas sortir avec votre smartphone uniquement !)
        </p>
      </div>
      <TextInput
        name="full-name"
        label="Prénom, NOM"
        placeholder="ex: Provencal LE GAULOIS"
        value={name}
        onChange={v => setName(v)}
      />
      <TextInput
        name="birthdate"
        label="Date de naissance"
        placeholder="ex: 20/03/1882"
        value={birthdate}
        onChange={v => setBirthdate(v)}
      />
      <TextArea
        name="address"
        label="Adresse"
        placeholder={'ex: 83 Rue Saint Honoré\n75 001 - PARIS'}
        value={address}
        onChange={e => setAddress(e)}
      />

      <ReasonChoice label="Motif" reason={reason} onChange={v => setReason(v)} />

      <TextInput
        name="city"
        label="Fait à"
        placeholder="ex: Paris"
        value={place}
        onChange={v => setPlace(v)}
      />

      <DayMonthInput label="Fait le" day={day} month={month} setDay={setDay} setMonth={setMonth} />

      <SignatureInput label="Signature" signature={signature} setSignature={setSignature} />

      {missingMessages.length > 0 && (
        <div className={'App--info' + (missingMessages.length === 1 ? ' center' : '')}>
          <WarningIcon />
          {missingMessages.length === 1 ? (
            <p>{missingMessages[0]}</p>
          ) : (
            <div>
              <p>Certaines informations sont manquantes:</p>
              <ul>
                {missingMessages.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <CheckBox
        value={save}
        onChange={setSave}
        label="Sauvegarder les informations pour la prochaine fois"
      />

      <button
        type="button"
        className="App--submit"
        onClick={() => {
          if (save) {
            setStoreData({
              name,
              address,
              birthdate,
              place,
              signature
            });
          }
          generateDocument({
            name,
            address,
            birthdate,
            reason,
            day: String(day).padStart(2, '0'),
            month: String(month + 1).padStart(2, '0'),
            place,
            signature
          });
        }}
      >
        Générer le document
      </button>
      <div className="App--clear">
        <button
          onClick={() => {
            const confirm = window.confirm('Etes-vous sùr ?');
            if (confirm) {
              store.remove(STORAGE_KEY);
            }
          }}
        >
          Supprimer les données sauvegardées
        </button>
      </div>
      <div className="App--about">
        <p>
          Un outil créé par <a href="https://twitter.com/Etienne_dot_js">Etienne.js</a>
        </p>
      </div>
    </div>
  );
}

export default App;
