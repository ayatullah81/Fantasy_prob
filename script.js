/******************************************
*********** QUIZE CONTROLLER MODULE*********
********************************************/
var quizeController = (function(){
    //******** question constructor *********/
    function Question(id, questionText, options, correctAnswer){
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
        
    }
    
    var questionLocalStorage = {
        setQuestionCollection: function(newCollection){
            localStorage.setItem('questionCollection', JSON.stringify(newCollection))
        },
        getQuestionCollection: function(){
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestCollection: function(){
            localStorage.removeItem('questionCollection');
        }
    }
    if(questionLocalStorage.getQuestionCollection() === null){
        questionLocalStorage.setQuestionCollection([]);  
      };

    var quizProgress = {
        progressIndx: 0
    }
    
    var currentPersonData = {
        fullName : [],
        score: 0
    }

    var adminFullName = ['Ayatullah', 'Ayat']

    function createPerson(id, firstName, lastName, score){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.score = score;
    }

    var personLocalStorage = {
        
        setPersonInStorage: function(newPers){
            localStorage.setItem('personData', JSON.stringify(newPers));
        },
        getPersonFromStorage: function(){
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonFromStorage: function(){
            localStorage.removeItem('personData');
        }

    }
    
    if(personLocalStorage.getPersonFromStorage() === null){
        personLocalStorage.setPersonInStorage([]);
    }

    return{

        // temporary

        

        getCurrPersonData: currentPersonData,

        getAdmin: adminFullName,

        getPersonLocalStorage: personLocalStorage,


        addPersonOnLocalStorage: function(){
            var personId, storedNewPerson, score = 0;

            if(personLocalStorage.getPersonFromStorage().length > 0){
                personId = personLocalStorage.getPersonFromStorage()[personLocalStorage.getPersonFromStorage().length - 1].id + 1;
            }else{
                personId = 0;
            }

            var newPerson = new createPerson(personId, currentPersonData.fullName[0], currentPersonData.fullName[1], currentPersonData.score);

            
            storedNewPerson = personLocalStorage.getPersonFromStorage();

            storedNewPerson.push(newPerson);

            personLocalStorage.setPersonInStorage(storedNewPerson);
        },

        
        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function(newQuestText, opts){
            var optionsArr,
            corrAns,
            questionId,
            newQuestion, //it's an constructed object...
            getStoredQuests;
            isChecked = false;
            optionsArr = [];
            
           
            if(questionLocalStorage.getQuestionCollection() === null){
              questionLocalStorage.setQuestionCollection([]);  
            }
            
            opts.forEach(function(item){
                if(item.value !== ""){
                  optionsArr.push(item.value);  
                }
                if(item.previousElementSibling.checked && item.value !== ''){
                    corrAns = item.value;
                    isChecked = true;
                }
            });

          if(questionLocalStorage.getQuestionCollection().length > 0){
              questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
          }else{
              questionId = 0;
          }
          
          if(newQuestText.value !== ""){
              if(optionsArr.length > 1){
                  if(isChecked){
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                            
                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                       
                        newQuestText.value = "";

                        opts.forEach(function(item){
                            item.value = "";
                            item.previousElementSibling.checked = false;
                        });

                        return true;
                     
            }else{
                alert('you missed to check, or you missed to put value');
                return false;
                
            }
            }else{
                alert('please fill up this two options');
                return false;
            }
        }else{
            alert('Please insert Question');
            return false;
        }
           
            
        },

        

        checkCorrectAnswer: function(ans){
            if(questionLocalStorage.getQuestionCollection()[quizProgress.progressIndx].correctAnswer === ans.textContent){
                currentPersonData.score++;
                return true;
            }else{
                return false;
            }
        },

        isFinished: function(){
            if(quizProgress.progressIndx + 1 === questionLocalStorage.getQuestionCollection().length){
                return true;
            }else{
                return false;
            }
        }
    }

})();
/******************************************
************* UI CONTROLLER *****************
********************************************/
var UIController = (function(){
    var domItems = {

        /****** ADMIN PANEL ELEMENTS *******/
        adminPanelContainer: document.querySelector('.admin-panel-container'),
        questInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),

        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector('.admin-option-cotainer'),

        insertedQuestWrapper: document.querySelector('.inserted-questions-wrapper'),

        questUpdateBtn: document.getElementById('question-update-btn'),
        questDeleteBtn: document.getElementById('question-delete-btn'),

        questClearBtn: document.getElementById('question-clear-btn'),

        /******* QUIZ PANEL ELEMENTS *******/
        quizContainer: document.querySelector('.quiz-container'),
        askedquestionText: document.getElementById('asked-question-text'),
        quizeOptionsWrapper: document.querySelector('.quiz-options-wrapper'),

        progressBar: document.querySelector('progress'),
        progressPar: document.getElementById('progress'),

        /************ Instant question container**********/

        instantQuestionContainer: document.querySelector('.instant-answer-container'),
        instantAnswerText: document.getElementById('instant-answer-text'),
        emotion: document.getElementById('emotion'),
        nextQuestBtn: document.getElementById('next-question-btn'),

        /************ Landing Page Container**********/
        landPageContainer: document.querySelector('.landing-page-container'),
        startQuiz: document.getElementById('start-quiz-btn'),
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('secondName'),

        /************ FINAL RESULT **********/

        finalResultContainer: document.querySelector('.final-result-container'),

        finalScore: document.getElementById('final-score-text'),
        resultListWrapper: document.querySelector('.results-list-wrapper')


    }

    return{
        getDomItems: domItems,

        addInputsDynamically: function(){
            var addInput = function(){
                var inputHTML, z;
                
                z = document.querySelectorAll('.admin-option').length;

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
                
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            } 
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput)
        },

        createQuestionList: function(getQuestions){
            var inputHTML, num = 0;
                        
            domItems.insertedQuestWrapper.innerHTML = "";

            for(var i = 0; i < getQuestions.getQuestionCollection().length; i++){
                num = i + 1;
                inputHTML = '<p><span>'+ num +'. '+ 
                getQuestions.getQuestionCollection()[i].questionText +
                '</span><button id="question-'+ getQuestions.getQuestionCollection()[i].id +'">Edit</button></p>';

                domItems.insertedQuestWrapper.insertAdjacentHTML("afterbegin", inputHTML);

                

            }

        },

        editQuestList: function(event, storageQuestList, addInputsFn, updateQuestFn){
            var getID,
                getStorageQuestList,
                foundItem,
                optionHTML,
                placeInArr;
            if('question-'.indexOf(event.target.id)){
                getID = parseInt(event.target.id.split('-')[1]);

                getStorageQuestList = storageQuestList.getQuestionCollection();
                for(var i = 0; i < getStorageQuestList.length; i++){
                    if(getStorageQuestList[i].id === getID){
                        foundItem = getStorageQuestList[i];
                        placeInArr = i;
                    }
                }
                
                domItems.newQuestionText.value = foundItem.questionText;

                domItems.adminOptionsContainer.innerHTML = "";

                optionHTML = '';

                for(var x = 0; x < foundItem.options.length; x++){
                    
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ x 
                    +'" value="'+ x +'"><input type="text" class="admin-option admin-option-'+ x 
                    +'" value="'+ foundItem.options[x] +'"></div>'
                    
                }

                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questDeleteBtn.style.visibility = 'visible';

                domItems.questInsertBtn.style.visibility = 'hidden';
                
                addInputsFn();

                var backDefaultView = function(){

                    var updateOptionsEls = document.querySelectorAll('.admin-option');

                    domItems.newQuestionText.value = '';

                    for(var j = 0; j < updateOptionsEls.length; j++){
                        updateOptionsEls[j].value = '';
                        updateOptionsEls[j].previousElementSibling.checked = false;
                    }

                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questDeleteBtn.style.visibility = 'hidden';

                    domItems.questInsertBtn.style.visibility = 'visible';

                    updateQuestFn(storageQuestList);
                }
                
                var updateQuestion = function(){
                    var newOptions, optionsEls;

                    newOptions = [];

                    optionsEls = document.querySelectorAll('.admin-option');

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';

                    for(var indx = 0; indx < optionsEls.length; indx++){
                        if(optionsEls[indx].value !== ''){
                           newOptions.push(optionsEls[indx].value);

                           if(optionsEls[indx].previousElementSibling.checked){
                               foundItem.correctAnswer = optionsEls[indx].value;
                           } 
                        }
                    }
                    
                    foundItem.options = newOptions;
                    
                    if(foundItem.questionText !== ''){
                        if(foundItem.options.length > 1){
                            if(foundItem.correctAnswer !== ''){
                                getStorageQuestList.splice(placeInArr, 1, foundItem);

                                storageQuestList.setQuestionCollection(getStorageQuestList);

                                backDefaultView();

                            }else{
                                alert('You missed to check option');
                            }
                        }else{
                            alert('Please insert at least two options')
                        }
                    }else{
                        alert('Please insert Question')
                    }
                    
                }

                domItems.questUpdateBtn.onclick = updateQuestion;

                var DeleteQuestion = function(){
                    getStorageQuestList.splice(placeInArr, 1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);

                    backDefaultView();
                }

                domItems.questDeleteBtn.onclick = DeleteQuestion;

            }
        },

        clearQuestList: function(storageQuestList){
            
            if(storageQuestList.getQuestionCollection() !== null){
                if(storageQuestList.getQuestionCollection().length > 0){
                    var conf = confirm('If you are sure you want to delete all Questions List, press OK');
                    
                    if(conf){
                        storageQuestList.removeQuestCollection();

                        domItems.insertedQuestWrapper.innerHTML = "";
                    }
                }
            }
        },

        addQuestions: function(storageQuestList, progress){
            if(storageQuestList.getQuestionCollection().length > 0){
                
                var htmlOptions, optionsChar;

                optionsChar = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

                domItems.askedquestionText.textContent = storageQuestList.getQuestionCollection()[progress.progressIndx].questionText;
                
                domItems.quizeOptionsWrapper.innerHTML = '';
                
                htmlOptions = '';
                for(var i = 0; i < storageQuestList.getQuestionCollection()[progress.progressIndx].options.length; i++){
                    htmlOptions += '<div class="choice-'+ i +'"><span class="choice-'+ i +'">'+ optionsChar[i] +'</span><p class="choice-'+ i +'">'+ storageQuestList.getQuestionCollection()[progress.progressIndx].options[i] +'</p></div>'
                    
                }

                domItems.quizeOptionsWrapper.insertAdjacentHTML('beforeend', htmlOptions)

                
            
            }
        },

        displayProgress: function(storageQuestList, progress){
           domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
           domItems.progressBar.value = progress.progressIndx + 1;
           
           domItems.progressPar.textContent = domItems.progressBar.value + '/' + domItems.progressBar.max;
        },

        newDesign: function(chckAns, ans){

            var indx = 0;

            if(chckAns){
                indx = 1;
            }

            var twoOptions = {
                answer: ['This is a Wrong Answer', 'This is a Correct answer, You are the Genius'],
                bgColors: ['red', 'green'],
                emoji: ['https://cdn.pixabay.com/photo/2016/08/31/20/04/emoticon-1634515__340.png',
                        'https://cdn.pixabay.com/photo/2019/02/19/19/45/thumbs-up-4007573__340.png'],

                bgOptn: ['red', 'salmon']
            }
            
            domItems.quizeOptionsWrapper.style.cssText = 'opacity: 0.7; pointer-events: none';
            

            domItems.instantQuestionContainer.style.opacity = '1';
            domItems.instantQuestionContainer.style.backgroundColor = twoOptions.bgColors[indx];
            
            domItems.emotion.setAttribute('src', twoOptions.emoji[indx])

            domItems.instantAnswerText.textContent = twoOptions.answer[indx];
            
            ans.previousElementSibling.style.backgroundColor = twoOptions.bgOptn[indx];
            ans.parentElement.style.backgroundColor = 'white';
            ans.parentElement.style.fontWeight = 'bold';
            
        },

        resetDesign: function(){
            domItems.quizeOptionsWrapper.style.cssText = "";
            domItems.instantQuestionContainer.style.opacity = '0';
        },

        getFullName: function(currPersnData, questLocalStrg, admin){
            
            if(domItems.firstName.value !== "" && domItems.lastName.value !== ""){
                if(!(domItems.firstName.value === admin[0] && domItems.lastName.value === admin[1])){
                    if(questLocalStrg.getQuestionCollection().length > 0){
                            currPersnData.fullName.push(domItems.firstName.value);
                            currPersnData.fullName.push(domItems.lastName.value);
                            console.log(currPersnData.fullName);
                            domItems.landPageContainer.style.display = 'none';
                            domItems.quizContainer.style.display = 'block';
                    }else{
                        alert('Quiz is not ready, please contacts with administrator');
                        alert('To see admin Fullname, go to console');
                        console.log('firstName: Ayatullah');
                        console.log('lastName: Ayat');
                    }
                    
                }else{
                    domItems.landPageContainer.style.display = 'none';
                    domItems.adminPanelContainer.style.display = 'block';
                }
            }else{
                alert('You forget to insert firstName and lastName');
            }
        },
        resultInAdminSection: function(localStoragesPerson){
            var inputHTML, firstName, lastName, leng, scr;
            leng = localStoragesPerson.getPersonFromStorage().length;
            
            domItems.resultListWrapper.innerHTML = "";
            for(var i = 0; i < leng; i++){
                firstName = localStoragesPerson.getPersonFromStorage()[i].firstName;
                lastName = localStoragesPerson.getPersonFromStorage()[i].lastName;
                scr = localStoragesPerson.getPersonFromStorage()[i].score;
                inputHTML = '<p>'+ firstName + ' '+ lastName +' <span> point is: '+ scr +'<input class = "del-btn" type = "button" value = "delete"></span></p>';

                domItems.resultListWrapper.insertAdjacentHTML("beforeend", inputHTML)
            }
        },

        deleteResultFromAdmnSection: function(){

        }
    }

})();
/******************************************
**************** CONTROLLER **************
******************************************/

var controller = (function(quizeCntrl, uiCntrl){
    var selectedDomItems = uiCntrl.getDomItems;

    uiCntrl.addInputsDynamically();

    uiCntrl.createQuestionList(quizeCntrl.getQuestionLocalStorage);

    selectedDomItems.questInsertBtn.addEventListener('click', function(){
        var checkBoolean = quizeCntrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, document.querySelectorAll('.admin-option'));
        
        if(checkBoolean){
            uiCntrl.createQuestionList(quizeCntrl.getQuestionLocalStorage);
        }
    });

    selectedDomItems.insertedQuestWrapper.addEventListener('click', function(e){
        
        uiCntrl.editQuestList(e, quizeCntrl.getQuestionLocalStorage, uiCntrl.addInputsDynamically, uiCntrl.createQuestionList);
    });

    selectedDomItems.questClearBtn.addEventListener('click', function(){
        
        uiCntrl.clearQuestList(quizeCntrl.getQuestionLocalStorage);
    });

    uiCntrl.addQuestions(quizeCntrl.getQuestionLocalStorage, quizeCntrl.getQuizProgress);

    uiCntrl.displayProgress(quizeCntrl.getQuestionLocalStorage, quizeCntrl.getQuizProgress);


    selectedDomItems.quizeOptionsWrapper.addEventListener('click', function(event){

            var updateOptionsDiv = selectedDomItems.quizeOptionsWrapper.querySelectorAll('div');
            for(var i = 0; i < updateOptionsDiv.length; i++){
                if(event.target.className === 'choice-' + i){
                    var answer = document.querySelector('.quiz-options-wrapper div p.' + event.target.className);
                    var checkAnswer = quizeCntrl.checkCorrectAnswer(answer);
                    uiCntrl.newDesign(checkAnswer, answer);

                    if(quizeCntrl.isFinished()){
                        selectedDomItems.nextQuestBtn.textContent = 'Finish Quiz';
                    }

                    var nextQuestion = function(questData, progressBar){
                        if(quizeCntrl.isFinished()){
                            var first, last, scr;
                            quizeCntrl.addPersonOnLocalStorage();

                            first = quizeCntrl.getPersonLocalStorage.getPersonFromStorage()[quizeCntrl.getPersonLocalStorage.getPersonFromStorage().length - 1].firstName;
                            last = quizeCntrl.getPersonLocalStorage.getPersonFromStorage()[quizeCntrl.getPersonLocalStorage.getPersonFromStorage().length - 1].lastName;
                            scr = quizeCntrl.getPersonLocalStorage.getPersonFromStorage()[quizeCntrl.getPersonLocalStorage.getPersonFromStorage().length - 1].score;
                            selectedDomItems.quizContainer.style.display = "none";
                            selectedDomItems.finalResultContainer.style.display = "block";
                            selectedDomItems.finalScore.textContent = first + ' ' + last + ' Your Score is ---> ' + scr;

                        }else{
                            progressBar.progressIndx++;
                            uiCntrl.resetDesign();
                            uiCntrl.addQuestions(questData, progressBar);
                            uiCntrl.displayProgress(questData, progressBar);
                        }
                    }

                    selectedDomItems.nextQuestBtn.onclick = function(){
                        
                        nextQuestion(quizeCntrl.getQuestionLocalStorage, quizeCntrl.getQuizProgress);

                    }

                }
            }
    });
    

    //////// ***********LOGIN PAGE***********///////

    selectedDomItems.startQuiz.addEventListener('click', function(){
     
        uiCntrl.getFullName(quizeCntrl.getCurrPersonData, quizeCntrl.getQuestionLocalStorage, quizeCntrl.getAdmin);
  
    })

   uiCntrl.resultInAdminSection(quizeCntrl.getPersonLocalStorage); 
   
   

})(quizeController, UIController);










//https://youtu.be/t8P6FELv71A?t=4537

//https://youtu.be/t8P6FELv71A?t=6756

// https://youtu.be/t8P6FELv71A?t=18830