import axios from 'axios';

export default async function handler(req,res){
    if(req.method=='POST'){
        const {category} = req.body;
        try{
            const response = await axios.post('/predict',{category})
            res.status(200).json(response.data);

        }catch(error){
            res.status(500).json({error:'error running model'})

        }
    }else{
        res.status(405).json({error:"method not allowed"})
    }
}