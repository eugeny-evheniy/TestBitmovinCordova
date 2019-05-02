/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var demoUrl = "https://academy.zenva.com/wp-json/zva-mobile-app/v1/demoWidevine";
var paused = false;
var is_downloading = false;
var streaming_url = "https://zavideoplatform.streaming.mediaservices.windows.net///2c856c2a-b469-4a0d-a6c1-984fee7017c9/03. Creating Numpy Arrays.ism/manifest(format=mpd-time-csf,encryption=cenc)";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjYWRlbXkuemVudmEuY29tIiwiaWF0IjoxNTU2NzU1MzIwLCJleHAiOjE1NTY3Njk3NTAsImF1ZCI6Imh0dHBzOi8vYWNhZGVteS56ZW52YS5jb20iLCJzdWIiOjAsInp2YWlwIjoiNjAuMjAuMC4yNTAiLCJ6dmFwb3N0IjowfQ.sjx33a8nbwFfjgQ32DCwh3wFtEJqTVomSS6T4HucHBg";
var ccUrl = "https://zavideoplatform.blob.core.windows.net/closed-captions/lesson-635112-en.vtt";
var lessonId = "ZenvaTest2";

var setListener = function() {
    $("#stream_video").click(function(){
        window.plugins.Bitmovin.streamVideo(streaming_url, token, ccUrl, 10,
            function(data){
                if(data.event="action")
                {
//                    alert(data.value);
                }
            },
            function(err){
                alert(err);
            }
        );
    });

    $("#download_video").click(function(){
        is_downloading = true;
        $("#delete_downlaodvideo").attr("disabled", false);
        $("#pause_resume_download").attr("disabled", false);
        window.plugins.Bitmovin.downloadVideo(streaming_url, token, ccUrl, lessonId, 540,
            function(data){
                console.log(data);
                if(data.event == "progress"){
                    $("#myBar").width(data.value + '%');
                    $("#myValue").html(data.value + '%');
                }
                if(data.event == "complete"){
                    is_downloading = false;
                    $("#pause_resume_download").attr("disabled", true);
                    $("#play_downloadvideo").attr("disabled", false);
                }
                if(data.event == "error"){
//                    alert(data.value);
                }
            },
            function(err){
                console.error(err);
                alert(err);
            }
        );
    });

   $("#pause_resume_download").click(function(){
        if(!is_downloading){
            return false;
        }
        paused = !paused;
        if(paused){
            window.plugins.Bitmovin.pauseDownload(lessonId);
            $("#pause_resume_download").html("Resume");
        }else{
            window.plugins.Bitmovin.resumeDownload(lessonId);
            $("#pause_resume_download").html("Pause");
        }
    });

    $("#stop_download").click(function(){
        if(!is_downloading){
            return false;
        }
        window.plugins.Bitmovin.stopDownload(lessonId);
    });

    $("#play_downloadvideo").click(function(){
        window.plugins.Bitmovin.playDownloadedVideo(lessonId, 0);
    });

    $("#delete_downlaodvideo").click(function(){
        window.plugins.Bitmovin.deleteDownloadedVideo(lessonId);
        $("#play_downloadvideo").attr("disabled", true);
        $("#delete_downlaodvideo").attr("disabled", true);
    });
}

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        $.get( demoUrl, function( data ) {
          streaming_url = data.streamingLocatorUrlWidevine;
          token = data.tokenWidevine;
          ccUrl = data.ccUrl;
          setListener();
        }).fail(function() {
              alert('Cannot get Info from demo url. Please check Network.'); // or whatever
          });
    }
};

app.initialize();