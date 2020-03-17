import React from 'react';
import { useDropzone } from 'react-dropzone';

export interface Signature {
  type: 'png' | 'jpg';
  data: string;
}

interface Props {
  signature: Signature | null;
  setSignature: (value: Signature | null) => void;
  label: string;
}

export const SignatureInput: React.FC<Props> = ({ label, setSignature, signature }) => {
  const onDrop = React.useCallback(
    (acceptedFiles: Array<File>) => {
      acceptedFiles.forEach(file => {
        const type = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : null;
        if (type === null) {
          return;
        }

        const reader = new FileReader();
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          // Do whatever you want with the file contents
          const imageStr = reader.result as string;
          setSignature({
            type: type,
            data: imageStr
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [setSignature]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ['image/jpeg', 'image/png']
  });

  return (
    <div className="SignatureInput">
      <p className="label">{label}</p>
      <div className="SignatureInput--block">
        {signature ? (
          <>
            <img className="SignatureInput--img" src={signature.data} alt="signature" />
            <button
              type="button"
              className="SignatureInput--remove"
              onClick={() => setSignature(null)}
            >
              Supprimer l'image
            </button>
          </>
        ) : (
          <div {...getRootProps({ className: 'SignatureInput--drop' })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Déposer le fichier ici...</p>
            ) : (
              <p>
                Déposer un fichier Image
                <br />
                <span className="SignatureInput--click">ou cliquer ici</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
