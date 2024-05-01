export default function checkBirthday(nasc:any): boolean{
    const today:Date = new Date()
    const nascimento:Date = typeof "string" ? new Date(nasc) : nasc;

    let diferenca = today.getFullYear() - nascimento.getFullYear()

    const mesAtual = today.getMonth();
    const diaAtual = today.getDate();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        diferenca--;
    }

    if (diferenca <= 9){
        return true
    }
    return false
}