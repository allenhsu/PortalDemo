//
//  PLNavigation.m
//  alipay
//
//  Created by Allen Hsu on 7/1/13.
//  Copyright (c) 2013 Allen Hsu. All rights reserved.
//

#import "AppDelegate.h"
#import "PLNavigation.h"
#import "HtmlViewController.h"

@implementation PLNavigation

@synthesize callbackID;

- (void)dealloc
{
    [callbackID release];
    [super dealloc];
}

- (void)setLeftItemAction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setLeftTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setLeftIcon:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setRightItemAction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setCenterItemAction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setRightItemTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setCenterItemTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setRightTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setRightIcon:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setSlaverightTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setSlaverightIcon:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)setDefaultBackFunction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    
}

- (void)popToRoot:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    if ([self.viewController isKindOfClass:[HtmlViewController class]] && arguments.count > 1) {
        HtmlViewController *htmlViewController = (HtmlViewController *)self.viewController;
        [htmlViewController popToRoot:arguments];
    }
}

- (void)popWindow:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    if ([self.viewController isKindOfClass:[HtmlViewController class]] && arguments.count > 1) {
        HtmlViewController *htmlViewController = (HtmlViewController *)self.viewController;
        [htmlViewController popWindow:arguments];
    }
}

- (void)reportError:(NSMutableArray*)arguments
{
    
}

- (void)pushWindow:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options 
{
    if ([self.viewController isKindOfClass:[HtmlViewController class]] && arguments.count > 1) {
        HtmlViewController *htmlViewController = (HtmlViewController *)self.viewController;
        [htmlViewController pushWindow:arguments];
    }
}

@end
