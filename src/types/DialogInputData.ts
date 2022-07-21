import {FormRules} from "element-plus";

export interface IDialogInputData<T> {
    formId: number,
    isShowDialog: boolean,
    dataForm: T,
    dataRule: FormRules
}


export class DialogInputData<T> implements IDialogInputData<T> {

    dataForm: T
    dataRule: FormRules

    constructor(t: T, dataRule: FormRules) {
        this.dataForm = t
        this.dataRule = dataRule
    }

    formId = 0
    isShowDialog = false

}