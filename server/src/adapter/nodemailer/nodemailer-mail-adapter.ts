import nodemailer from 'nodemailer'

import { MailAdapter, SendMailData } from '../mail-adapter'

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c11222a45e8972",
    pass: "ea003ae898c202"
  }
});

export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({ subject, body }: SendMailData) {
    await transport.sendMail({
      from: 'Equipe Feedget <oi@feedget.com>',
      to: 'Gabriel Ramos <dev.gabrielramos@gmail.com>',
      subject,
      html: body,
    })
  }
}