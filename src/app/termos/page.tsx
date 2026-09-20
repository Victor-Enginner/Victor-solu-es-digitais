import type { Metadata } from "next";
import { LegalPage } from "../../components/ui/legal-page";
import { CONTACT_EMAIL } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Termos de Uso | Victor AI Engineer",
  description: "Termos de uso do programa de parceiros da Victor AI Engineer - Soluções Digitais.",
};

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Uso" updated="20/09/2026">
      <section>
        <h2>1. O que é o programa</h2>
        <p>
          O site permite que pessoas (&quot;parceiros&quot;) indiquem empresas que precisam de tecnologia (sites,
          automação de WhatsApp, sistemas e agentes de IA). A <strong>Victor AI Engineer - Soluções Digitais</strong>{" "}
          faz a proposta comercial, desenvolve a solução e paga comissão ao parceiro quando a indicação vira contrato.
        </p>
      </section>

      <section>
        <h2>2. Comissões</h2>
        <ul>
          <li>
            Os valores exibidos no simulador são <strong>estimativas</strong> e podem ser ajustados por serviço.
          </li>
          <li>
            A comissão é devida apenas quando a indicação resulta em contrato assinado e o pagamento do cliente é
            confirmado; é paga via Pix para a chave informada no cadastro.
          </li>
          <li>Não há garantia de ganho: o resultado depende do interesse e da decisão de cada empresa.</li>
        </ul>
      </section>

      <section>
        <h2>3. Responsabilidades do parceiro</h2>
        <ul>
          <li>Informar dados verdadeiros e manter a chave Pix correta e a senha em sigilo.</li>
          <li>Abordar empresas de forma honesta, sem prometer resultados em nome da Victor AI.</li>
          <li>Não enviar spam nem usar o programa para fins ilegais.</li>
        </ul>
      </section>

      <section>
        <h2>4. Indicação duplicada</h2>
        <p>
          Se a empresa já for cliente ou já tiver sido indicada por outro parceiro, a indicação poderá ser
          desqualificada. Vale a primeira indicação válida registrada.
        </p>
      </section>

      <section>
        <h2>5. Alterações e encerramento</h2>
        <p>
          Podemos atualizar estes termos e encerrar contas que descumpram as regras. Comissões de contratos já
          fechados e pagos pelo cliente permanecem devidas.
        </p>
      </section>

      <section>
        <h2>6. Contato</h2>
        <p>
          Dúvidas: <strong>{CONTACT_EMAIL}</strong>. Foro: Comarca de Franca - SP.
        </p>
      </section>

      <p className="text-xs italic">
        Este texto é um modelo inicial e não substitui orientação jurídica. Recomenda-se revisão por profissional
        habilitado.
      </p>
    </LegalPage>
  );
}
