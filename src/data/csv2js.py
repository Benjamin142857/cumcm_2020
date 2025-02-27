import pandas as pd


def csv2js(csv_name, js_name):
    df = pd.read_csv(csv_name, encoding='gbk')
    data_text = "export const companyData = [\n"

    for i in range(len(df)):
        row = df.iloc[i]
        if (row['grade'] == 'D'):
            continue
        data_text += "  {{comCode: '{comCode}', grade: '{grade}', score: {score}, creditLimit: 0, interestRate: 0.00, loss: false, repayRate: 1.00, isRepay: true, inf: {inf}}},\n".format(
            comCode=row['comCode'],
            grade=row['grade'],
            score=row['score']*100,
            inf=row.get('inf', 0),
        )
    data_text += "];"
    with open(js_name, 'w+') as f:
        f.write(data_text);
        f.close()


if __name__ == '__main__':
    csv2js("p2_v2.csv", "companyData.js")
