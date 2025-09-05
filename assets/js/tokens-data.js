fetch("https://ai-meneger-edward0076.amvera.io/chat_gpt/token_info/")
.then(res => res.json())
.then(res => {

    document.querySelector("#gpt_info_model").innerHTML = res.model;
    document.querySelector("#in_tokens_number").innerHTML = res.input_tokens;
    document.querySelector("#out_tokens_number").innerHTML = res.output_tokens;
    document.querySelector("#in_tokens_cost").innerHTML = res.input_cost_usd;
    document.querySelector("#out_tokens_cost").innerHTML = res.output_cost_usd;
    document.querySelector("#total_cost").innerHTML = res.total_cost_usd;

});