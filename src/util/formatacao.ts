export default class formatacaoOutput{
    static excludeKeys(data: any, keys: string[]) : any {
        const entries = Object.entries(data);

        let output : any = {};

        for (let i = 0; i < entries.length; i++) {
            const element = entries[i];
            
            if(!keys.includes(element[0]))
            {
                output[element[0]] = data[element[0]]
            }

        }

        return output;

    }

    static excludeArrayKeys(data : any[], keys: string[]) : any[] {
        let output : any[] = [];
        const input = data;


        for (let i = 0; i < input.length; i++) {
            const element = input[i];
            
            output.push(this.excludeKeys(element, keys));

        }



        return output;
    }
}