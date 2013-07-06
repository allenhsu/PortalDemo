//
//  PLNavigation.h
//  alipay
//
//  Created by Allen Hsu on 7/1/13.
//  Copyright (c) 2013 Allen Hsu. All rights reserved.
//

#import <Cordova/CDVPlugin.h>

@interface PLNavigation : CDVPlugin
{
    NSString *callbackID;
}

@property(copy, nonatomic) NSString *callbackID;

- (void)setLeftItemAction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setLeftTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setLeftIcon:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setRightItemAction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setCenterItemAction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setRightItemTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setCenterItemTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setRightTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setRightIcon:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setSlaverightTitle:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setSlaverightIcon:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)setDefaultBackFunction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)popToRoot:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)popWindow:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)reportError:(NSMutableArray*)arguments;
- (void)pushWindow:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
