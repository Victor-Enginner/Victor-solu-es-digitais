import type { Metadata } from "next";
import { LegalPage } from "../../components/ui/legal-page";
import { CONTACT_EMAIL, CONTACT_WHATSAPP_DISPLAY } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade | Victor AI Engineer",
  description: "Como a Victor AI Engineer - Soluções Digitais trata dados pessoais (LGPD).",
};

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade" updated="20/09/2026">
      <section>
        <h2>1. Quem é o controlador dos dados</h2>
        <p>
          <strong>Victor AI Engineer - Soluções Digitais</strong>, Franca - SP. Contato para assuntos de privacidade:{" "}
          <strong>{CONTACT_EMAIL}</strong> ou WhatsApp <strong>{CONTACT_WHATSAPP_DISPLAY}</strong>.
        </p>
      </section>

      <section>
        <h2>2. Quais dados coletamos</h2>
        <ul>
          <li>
            <strong>Parceiros (cadastro):</strong> nome, e-mail, WhatsApp, chave Pix e senha (guardada de forma
            criptografada pelo provedor de autenticação, nunca em texto puro).
          </li>
          <li>
            <strong>Indicações:</strong> nome da empresa indicada, cidade, serviço de interesse, WhatsApp e Instagram
            do estabelecimento.
          </li>
          <li>
            <strong>Uso do site:</strong> preferência de tema (claro/escuro) e sessão de login, guardadas no seu
            navegador.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Para que usamos</h2>
        <ul>
          <li>Registrar e acompanhar indicações comerciais e entrar em contato com as empresas indicadas.</li>
          <li>Pagar comissões via Pix aos parceiros.</li>
          <li>Avisar parceiros sobre mudanças de status das suas indicações.</li>
        </ul>
        <p>Não vendemos dados pessoais.</p>
      </section>

      <section>
        <h2>4. Com quem compartilhamos</h2>
        <p>
          Usamos prestadores para operar o site: hospedagem (Vercel), banco de dados e autenticação (Supabase) e,
          quando configurados, envio de mensagens e e-mails de notificação. Eles tratam os dados apenas para nos
          prestar o serviço.
        </p>
      </section>

      <section>
        <h2>5. Quem indica uma empresa</h2>
        <p>
          Ao indicar um estabelecimento, você declara que os dados de contato informados são comerciais e que pode
          compartilhá-los para fins de contato comercial. Não indique dados pessoais de terceiros sem motivo comercial.
        </p>
      </section>

      <section>
        <h2>6. Seus direitos (LGPD)</h2>
        <p>
          Você pode pedir confirmação de tratamento, acesso, correção, exclusão dos seus dados e revogar
          consentimento, escrevendo para <strong>{CONTACT_EMAIL}</strong>. Respondemos em prazo razoável.
        </p>
      </section>

      <section>
        <h2>7. Guarda e segurança</h2>
        <p>
          Mantemos os dados enquanto a conta estiver ativa ou pelo tempo necessário para obrigações legais e
          pagamentos. O acesso aos dados é restrito por regras de segurança no banco: cada parceiro vê apenas as
          próprias indicações.
        </p>
      </section>

      <p className="text-xs italic">
        Este texto é um modelo inicial e não substitui orientação jurídica. Recomenda-se revisão por profissional
        habilitado.
      </p>
    </LegalPage>
  );
}
