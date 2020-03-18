import React from 'react';
import { useDropzone } from 'react-dropzone';
import Pad from 'signature_pad';

export interface Signature {
  type: 'png' | 'jpg';
  data: string;
}

const ChevronLeft: React.FC = () => {
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
      className="feather feather-chevron-left"
      viewBox="0 0 24 24"
    >
      <path d="M15 18L9 12 15 6"></path>
    </svg>
  );
};

interface Props {
  signature: Signature | null;
  setSignature: (value: Signature | null) => void;
  label: string;
}

export const SignatureInput: React.FC<Props> = ({ label, setSignature, signature }) => {
  const [mode, setMode] = React.useState<null | 'upload' | 'draw'>(null);
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

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const padRef = React.useRef<Pad | null>(null);

  React.useEffect(() => {
    if (mode === 'draw' && signature === null && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const pad = new Pad(canvas, {});
      padRef.current = pad;
    }
  }, [mode, signature]);

  return (
    <div className="SignatureInput">
      <p className="label">{label}</p>
      <div className="SignatureInput--block">
        {(() => {
          if (signature) {
            return (
              <div className="SignatureInput--center">
                <img className="SignatureInput--img" src={signature.data} alt="signature" />
                <button
                  type="button"
                  className="SignatureInput--remove"
                  onClick={() => setSignature(null)}
                >
                  Supprimer l'image
                </button>
              </div>
            );
          }
          if (mode === null) {
            return (
              <div className="SignatureInput--choice">
                <button type="button" onClick={() => setMode('upload')}>
                  Envoyer une image
                </button>
                <button type="button" onClick={() => setMode('draw')}>
                  Dessiner
                </button>
              </div>
            );
          }
          if (mode === 'draw') {
            return (
              <div className="SignatureInput--tools">
                <div className="SignatureInput--back">
                  <button type="button" onClick={() => setMode(null)}>
                    <ChevronLeft />
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (padRef.current) {
                        if (padRef.current.isEmpty()) {
                          return alert('La signature est vide');
                        }
                        const data = padRef.current.toDataURL('image/png');
                        setSignature({ data, type: 'png' });
                        setMode(null);
                      }
                    }}
                  >
                    Sauvegarder
                  </button>
                </div>
                <div className="SignaturePad">
                  <canvas ref={canvasRef} />
                  <div className="SignaturePad--buttons">
                    <button
                      type="button"
                      className="SignaturePad--undo"
                      onClick={() => {
                        if (padRef.current) {
                          const data = padRef.current.toData();
                          if (data) {
                            data.pop(); // remove the last dot or line
                            padRef.current.fromData(data);
                          }
                        }
                      }}
                    >
                      Revenir en arière
                    </button>
                    <button
                      type="button"
                      className="SignaturePad--clear"
                      onClick={() => {
                        if (padRef.current) {
                          padRef.current.clear();
                        }
                      }}
                    >
                      Effacer
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div className="SignatureInput--tools">
              <div className="SignatureInput--back">
                <button type="button" onClick={() => setMode(null)}>
                  <ChevronLeft />
                  Annuler
                </button>
              </div>

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
            </div>
          );
        })()}
      </div>
    </div>
  );
};
