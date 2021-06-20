技術評論社『Javaによるアルゴリズム事典』（奥村晴彦他）に掲載されている乱数関連のアルゴリズムを
TypeScript で書いてます。　一部『改訂新版 C言語による標準アルゴリズム事典』も参考にしています。

TypeScript(JavaScript)では固定精度の整数型がないので、必要な箇所では bigint/BigInt を使用しています。
また、bigint リテラルを用いるために target を **ES2020** にしています。
