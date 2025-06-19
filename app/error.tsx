"use client";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#b91c1c', background: '#fff' }}>
      <h1>¡Ocurrió un error!</h1>
      <p>{error.message}</p>
      <p>Por favor, recarga la página o contacta al administrador.</p>
    </div>
  );
} 