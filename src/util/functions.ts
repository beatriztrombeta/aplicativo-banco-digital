//////////////////////////////////////////
//      VALIDAÇÃO DE CPFEEEEEEEEE       //
//////////////////////////////////////////

 export function validar_cpf(cpf: string): boolean {
    // Remover caracteres diferentes
    cpf = cpf.replace(/\D/g, '');
  
    if (cpf.length !== 11) {
      return false;
    }

    if (
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    ) {
      return false;
    }
  
    // Validação do 1o digito
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (sum * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
      return false;
    }
  
    // Validação do 2o digito
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (sum * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(10))) {
      return false;
    }
  
    return true;
  }
  

//////////////////////////////////////////
//      VALIDAÇÃO DE SENHAAAAAAAA       //
//////////////////////////////////////////

export function checar_senha_app(senha: string) {
    var numeros = senha.match(/\d+/g);
    var uppers  = senha.match(/[A-Z]/);
    var lowers  = senha.match(/[a-z]/);
    var especial = senha.match(/[!@#$%\^&*\+]/);

    var valid = true;

    if (numeros === null || uppers === null || lowers === null || especial === null) {
        valid = false;
    }
    
    if (senha.length < 8 || senha.length > 30) {
        valid = false;
    }
    
    if (sequencia_obvia(senha)) {
        valid = false;
    }
    
    return valid;
}


//////////////////////////////////////////
//      VALIDAÇÃO DE SENHA TRANSAC      //
//////////////////////////////////////////

export function checar_senha_trans(senha: string) {
  var numeros = senha.match(/\d+/g);
  var uppers  = senha.match(/[A-Z]/);
  var lowers  = senha.match(/[a-z]/);
  var especial = senha.match(/[!@#$%\^&*\+]/);

  var valid = true;

  if (!numeros || uppers || lowers || especial ) {
      valid = false;
  }
  
  if (senha.length > 4 || senha.length < 4) {
      valid = false;
  }
  
  if (sequencia_obvia(senha)) {
      valid = false;
  }
  
  return valid;
}

//////////////////////////////////////////

export function sequencia_obvia(senha: string): boolean {
    const seq_obvias = [
        '123', '234', '345', '456', '567', '678', '789', '890',
        '1234', '2345', '3456', '4567', '5678', '6789',
        '1221', '2332', '3443', '4554', '5665', '6776', '7887', '8998', '9889',
        '1111', '2222', '3333', '4444', '5555', '6666', '777', '8888', '9999',
        'qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'poiuyt', 'lkjhg',
        '098765', '987654', '876543', '765432', '654321', '543210'
    ];

    for (const sequencia of seq_obvias) {
        if (senha.toLowerCase().includes(sequencia)) {
            return true;
        }
    }
    
    return false;
}

//////////////////////////////////////////
//    VALIDAÇÃO DE SENHA TRANSCIONAL    //
//////////////////////////////////////////

export function checar_senha4d(senha_4d: string): boolean {
    // Ver se tem 4 digit
    if (/^\d{4}$/.test(senha_4d)) {
      // Se os numeros são iguais
      const primeiro_d = senha_4d.charAt(0);
      if (senha_4d.split('').every(digit => digit === primeiro_d)) {
        return false;
      }
      return true;
    }
    return false;
  }

//////////////////////////////////////////
//      VALIDAÇÃO DE EMAAAILLLLLL       //
//////////////////////////////////////////

export function validar_email(email:string): boolean{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//////////////////////////////////////////
//      VALIDAÇÃO DE TELEFONEEEEEE      //
//////////////////////////////////////////

export function validar_telefone(telefone: string): boolean {
    telefone = telefone.replace(/\D/g, '');
    if (!(telefone.length >= 10 && telefone.length <= 11)) {
      return false;
    }
    if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9) {
    return false;
    }
    for (var n = 0; n < 10; n++) {
        if (telefone == new Array(11).join(n.toString()) || telefone == new Array(12).join(n.toString())) {
        return false;
        }
    }
  
    const cod_DDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
                    21, 22, 24, 27, 28, 31, 32, 33, 34,
                    35, 37, 38, 41, 42, 43, 44, 45, 46,
                    47, 48, 49, 51, 53, 54, 55, 61, 62,
                    64, 63, 65, 66, 67, 68, 69, 71, 73,
                    74, 75, 77, 79, 81, 82, 83, 84, 85,
                    86, 87, 88, 89, 91, 92, 93, 94, 95,
                    96, 97, 98, 99];
    
    if (cod_DDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) {
        return false;
    }
    if (new Date().getFullYear() < 2017) {
        return true;
    }
    if (telefone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) == -1) {
        return false;
    }
    return true;
}
// //////////////////////////////////////////
// //      VALIDAÇÃO DE CEPEEEEEEEEEEEE    //
// //////////////////////////////////////////

// export function validar_cep(cep: string): boolean {
//   cep = cep.replace(/\D/g, '');
//   const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
//   if (cep.length !== 8) {
//     return false;
//   }
//   if (/^(\d)\1+$/.test(cep)) {
//     return false;
//   }
//   return cepRegex.test(cep);
// }

//////////////////////////////////////////
//           JSON WEB TOKENNNN          //
//////////////////////////////////////////

import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export function generateUserToken(cliente_id: string): string {
  const token = jwt.sign({ cliente_id }, process.env.JWT_SENHA ?? '', { expiresIn: '4000s' });
  
  return token;
}

// export function autenticarToken(token: string, segredo: string): boolean {
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SENHA ?? '') as JwtPayload;
//     console.log(payload)
//   } catch (error) {
//     return false;
//   }
// }

 //////////////////////////////////////////
//           NUMERO RANDOMICOOOO         //
///////////////////////////////////////////

export function numero_randomico(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//////////////////////////////////////////
//     VALIDAÇÃO DE SALDO => VALOR      //
//////////////////////////////////////////

export function verificar_saldo( saldo: number, valor: number): boolean {
  return saldo >= valor;
  
}


