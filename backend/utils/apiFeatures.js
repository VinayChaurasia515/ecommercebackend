class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
      //  console.log('ddd  ',this.queryStr.keyword)
        const keyword=this.queryStr.keyword
        ?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            }, 
         }
         :{};

         this.query=this.query.find({...keyword});
         return this;
    }

    filters(){
        const queryCopy={...this.queryStr}
        console.log("111",queryCopy)
        //remove some fields for categegory
        const removeFilters=["keyword","page","limit"];
        removeFilters.forEach((key)=> delete queryCopy[key]);
        console.log("222",queryCopy)

        //filter for price and rating
        let queryStr=JSON.stringify(queryCopy);
        console.log("333",queryStr)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        console.log("444",queryStr)


        //this.query=this.query.find(queryCopy)
        this.query=this.query.find(JSON.parse(queryStr))
    
        return this;
    }

    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page)||1;
        const skip=resultPerPage*(currentPage-1)
        this.query=this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures;