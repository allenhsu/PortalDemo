/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  MainViewController.h
//  Portal
//
//  Created by Allen Hsu on 7/3/13.
//  Copyright Allen Hsu 2013. All rights reserved.
//

#import "HtmlViewController.h"

@interface HtmlViewController()
- (void)extractMetaInfoFromWebView:(UIWebView *)theWebView;
- (NSString *)jsToGetContentOfMetaNamed:(NSString *)metaName;
- (NSDictionary *)dictionaryFromMetaString:(NSString *)metaString;
- (void)didClickOnRightBarItem:(id)sender;
@end

@implementation HtmlViewController

@synthesize storeLeftItem, storeRightItem;
@synthesize leftItemDict, rightItemDict;

- (id) initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void) didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

- (void) viewDidLoad
{
    [super viewDidLoad];
    firstTime = YES;
}

- (void) viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    if (firstTime) {
        firstTime = NO;
    } else {
        [self.webView stringByEvaluatingJavaScriptFromString:@"(function() { var channel = cordova.require(\"cordova/channel\"); channel.onPop.fire(); }())"];
    }
}

- (BOOL) shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

/* Comment out the block below to over-ride */
/*
 #pragma CDVCommandDelegate implementation
 
 - (id) getCommandInstance:(NSString*)className
 {
 return [super getCommandInstance:className];
 }
 
 - (BOOL) execute:(CDVInvokedUrlCommand*)command
 {
 return [super execute:command];
 }
 
 - (NSString*) pathForResource:(NSString*)resourcepath;
 {
 return [super pathForResource:resourcepath];
 }
 
 - (void) registerPlugin:(CDVPlugin*)plugin withClassName:(NSString*)className
 {
 return [super registerPlugin:plugin withClassName:className];
 }
 */

#pragma UIWebDelegate implementation

- (void) webViewDidFinishLoad:(UIWebView*) theWebView
{
    NSString *jsFile = [[NSBundle mainBundle] pathForResource:@"cordovaios" ofType:@"txt"];
    NSString* jsString = [NSString stringWithContentsOfFile:jsFile encoding:NSUTF8StringEncoding error:NULL];
    [theWebView stringByEvaluatingJavaScriptFromString:jsString];
    [theWebView stringByEvaluatingJavaScriptFromString:@"document.addEventListener(\"deviceready\", onDeviceReady, false)"];
    
    [self extractMetaInfoFromWebView:theWebView];
    
	return [super webViewDidFinishLoad:theWebView];
}

- (void)extractMetaInfoFromWebView:(UIWebView *)theWebView
{
    self.title = [theWebView stringByEvaluatingJavaScriptFromString:@"document.title"];
    
    NSString *jsString = [self jsToGetContentOfMetaNamed:@"right-bar-item"];
    NSString *rightBarItemMeta = [theWebView stringByEvaluatingJavaScriptFromString:jsString];
    
    if (rightBarItemMeta.length > 0) {
        self.rightItemDict = [self dictionaryFromMetaString:rightBarItemMeta];
        if ([self.rightItemDict objectForKey:@"title"]) {
            NSString *title = [self.rightItemDict objectForKey:@"title"];
            self.storeRightItem = [[[UIBarButtonItem alloc] initWithTitle:title style:UIBarButtonItemStyleBordered target:self action:@selector(didClickOnRightBarItem:)] autorelease];
            [self.navigationItem setRightBarButtonItem:self.storeRightItem animated:YES];
        }
    }
}

- (NSString *)jsToGetContentOfMetaNamed:(NSString *)metaName
{
    return [NSString stringWithFormat:@"$(\"meta[name='%@']\").attr('content')", metaName];
}

- (NSDictionary *)dictionaryFromMetaString:(NSString *)metaString
{
    NSArray *components = [metaString componentsSeparatedByString:@","];
    NSMutableDictionary *metaDict = [NSMutableDictionary dictionaryWithCapacity:components.count];
    for (NSString *meta in components) {
        NSArray *kv = [meta componentsSeparatedByString:@"="];
        if (2 == kv.count) {
            [metaDict setObject:[kv objectAtIndex:1] forKey:[kv objectAtIndex:0]];
        }
    }
    return metaDict;
}

- (void)popWindow:(NSMutableArray*)arguments
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)popToRoot:(NSMutableArray*)arguments
{
    [self.navigationController popToRootViewControllerAnimated:YES];
}

- (void)pushWindow:(NSMutableArray*)arguments
{
    HtmlViewController *nextViewController = [[[HtmlViewController alloc] init] autorelease];
    nextViewController.useSplashScreen = NO;
    nextViewController.wwwFolderName = self.wwwFolderName;
    NSString *currentPage = self.startPage;
    NSString *startPage = [[currentPage stringByDeletingLastPathComponent] stringByAppendingPathComponent:[arguments objectAtIndex:1]];
    nextViewController.startPage = startPage;
    [self.navigationController pushViewController:nextViewController animated:YES];
}

- (void)didClickOnRightBarItem:(id)sender
{
    if ([self.rightItemDict objectForKey:@"onclick"]) {
        NSString *onclickJs = [self.rightItemDict objectForKey:@"onclick"];
        [self.webView stringByEvaluatingJavaScriptFromString:onclickJs];
    }
}

/* Comment out the block below to over-ride */
/*
 
 - (void) webViewDidStartLoad:(UIWebView*)theWebView
 {
 return [super webViewDidStartLoad:theWebView];
 }
 
 - (void) webView:(UIWebView*)theWebView didFailLoadWithError:(NSError*)error
 {
 return [super webView:theWebView didFailLoadWithError:error];
 }
 
 - (BOOL) webView:(UIWebView*)theWebView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
 {
 return [super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType];
 }
 */

- (void)dealloc
{
    [storeTitleView release];
    [storeRightItem release];
    [storeLeftItem release];
    [rightItemDict release];
    [leftItemDict release];
    
    [super dealloc];
}

@end
