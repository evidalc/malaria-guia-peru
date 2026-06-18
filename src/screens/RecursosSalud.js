import { useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card } from '../components/Layout';

export default function RecursosSalud() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar title="Recomendaciones de Salud" back={-1} />
      <Screen>
        <Card style={{ padding: '20px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>♥</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-green)', marginBottom: 8 }}>Contenido próximamente</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Esta sección contendrá recomendaciones de salud para el paciente y su familia.
          </p>
        </Card>
      </Screen>
    </>
  );
}
